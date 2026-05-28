import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const FILTER_KEYWORDS = [
    "quote",
    "proposal",
    "estimate",
    "appointment",
    "consultation",
    "service",
    "booking",
    "follow up",
    "pricing",
    "invoice",
    "payment",
    "schedule",
    "meeting",
    "call",
    "demo",
    "site visit",
    "inspection",
    "repair",
    "installation",
    "maintenance",
    "project",
    "contract",
    "agreement",
    "client",
    "customer",
    "lead",
    "inquiry",
    "enquiry",
    "request",
    "availability",
    "reschedule",
    "follow-up",
    "remodel",
    "renovation",
    "onboarding",
];

const BLOCKED_DOMAINS = [
    "linkedin.com",
    "indeed.com",
    "mailchimp.com",
    "constantcontact.com",
    "hubspot.com",
    "zendesk.com",
    "facebookmail.com",
    "noreply.github.com",
    "notifications.google.com",
];

const BLOCKED_PREFIXES = [
    "noreply",
    "no-reply",
    "donotreply",
    "mailer",
    "notification",
    "support",
    "admin",
];

const MAX_GMAIL_MESSAGES_PER_SYNC = 20;

export type WorkerEnv = {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
};

type GmailConnection = {
    id?: string;
    user_id: string;
    email?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
    expiry?: string | null;
    connected?: boolean | null;
};

type GmailListResponse = {
    messages?: Array<{ id: string; threadId?: string }>;
};

type GmailHeader = {
    name?: string;
    value?: string;
};

type GmailMessagePart = {
    mimeType?: string;
    filename?: string;
    body?: {
        data?: string;
    };
    parts?: GmailMessagePart[];
};

type GmailMessageResponse = {
    id: string;
    threadId?: string;
    labelIds?: string[];
    snippet?: string;
    internalDate?: string;
    payload?: {
        headers?: GmailHeader[];
        body?: {
            data?: string;
        };
        parts?: GmailMessagePart[];
    };
};

type ContactRecord = {
    id: string;
    email: string | null;
};

type ExistingEmailRecord = {
    id: string;
    gmail_message_id: string | null;
};

type EmailFilterRecord = {
    id: string;
    keyword: string;
    filter_type: string;
    deleted: boolean;
};

type EmailFilterSet = {
    include: string[];
    exclude: string[];
};

type SyncGmailEmailsParams = {
    env: WorkerEnv;
    organizationId: string;
    userId: string;
};

type SyncGmailEmailsResult = {
    synced: number;
    matched: number;
};

type BackgroundSyncResult = {
    processedUsers: number;
    syncedEmails: number;
    matchedEmails: number;
    failures: Array<{
        userId: string;
        error: string;
    }>;
};

function decodeBase64Url(input: string) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (normalized.length % 4)) % 4;
    return atob(normalized + "=".repeat(padding));
}

function safeDecodeBase64Url(input: string) {
    try {
        return decodeBase64Url(input);
    } catch {
        return "";
    }
}

function decodeQuotedPrintable(input: string) {
    return input
        .replace(/=\r?\n/g, "")
        .replace(/=([A-Fa-f0-9]{2})/g, (_match, hex: string) =>
            String.fromCharCode(parseInt(hex, 16))
        );
}

function decodeMimeHeader(value: string | null | undefined) {
    if (!value) {
        return "";
    }

    return value.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g, (_match, _charset, encoding: string, encodedText: string) => {
        if (encoding.toUpperCase() === "B") {
            return safeDecodeBase64Url(encodedText.replace(/\s/g, ""));
        }

        return decodeQuotedPrintable(encodedText.replace(/_/g, " "));
    });
}

function stripHtml(input: string) {
    return input
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

function parseEmailAddress(input: string | null | undefined) {
    if (!input) {
        return { email: null, name: null };
    }

    const decoded = decodeMimeHeader(input).trim();
    const angleMatch = decoded.match(/^(.*)<([^>]+)>$/);
    if (angleMatch) {
        return {
            name: angleMatch[1].replace(/^"|"$/g, "").trim() || null,
            email: angleMatch[2].trim().toLowerCase(),
        };
    }

    const bareEmailMatch = decoded.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (bareEmailMatch) {
        return {
            name: decoded.replace(bareEmailMatch[0], "").replace(/[<>"()]/g, "").trim() || null,
            email: bareEmailMatch[0].toLowerCase(),
        };
    }

    return { email: null, name: decoded || null };
}

function getHeader(headers: GmailHeader[] | undefined, name: string) {
    return headers?.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? null;
}

function isSpamLikeMessage(message: GmailMessageResponse) {
    const labels = new Set(message.labelIds ?? []);
    if (
        labels.has("SPAM") ||
        labels.has("TRASH") ||
        labels.has("CATEGORY_PROMOTIONS") ||
        labels.has("CATEGORY_SOCIAL") ||
        labels.has("CATEGORY_FORUMS")
    ) {
        return true;
    }

    const headers = message.payload?.headers ?? [];
    const precedence = getHeader(headers, "Precedence")?.toLowerCase();
    const autoSubmitted = getHeader(headers, "Auto-Submitted")?.toLowerCase();
    const listId = getHeader(headers, "List-Id");
    const listUnsubscribe = getHeader(headers, "List-Unsubscribe");
    const xAutoResponseSuppress = getHeader(headers, "X-Auto-Response-Suppress")?.toLowerCase();

    if (precedence === "bulk" || precedence === "junk" || precedence === "list") {
        return true;
    }

    if (autoSubmitted && autoSubmitted !== "no") {
        return true;
    }

    if (listId || listUnsubscribe) {
        return true;
    }

    if (xAutoResponseSuppress?.includes("all")) {
        return true;
    }

    return false;
}

function isBlockedSender(email: string | null) {
    if (!email) return true;

    const lower = email.toLowerCase();

    const domain = lower.split("@")[1] || "";
    const prefix = lower.split("@")[0] || "";

    if (BLOCKED_DOMAINS.some((blockedDomain) => domain.includes(blockedDomain))) {
        return true;
    }

    if (BLOCKED_PREFIXES.some((blockedPrefix) => prefix.includes(blockedPrefix))) {
        return true;
    }

    return false;
}

function collectBodyText(part?: GmailMessagePart | { body?: { data?: string }; parts?: GmailMessagePart[] }) {
    if (!part) {
        return "";
    }

    const texts: string[] = [];
    const visit = (node?: GmailMessagePart | { body?: { data?: string }; parts?: GmailMessagePart[] }) => {
        if (!node) {
            return;
        }

        const bodyData = node.body?.data;
        if (bodyData) {
            const decoded = safeDecodeBase64Url(bodyData);
            if (!decoded) {
                return;
            }
            if ((node as GmailMessagePart).mimeType?.includes("html")) {
                texts.push(stripHtml(decoded));
            } else {
                texts.push(decoded.replace(/\s+/g, " ").trim());
            }
        }

        for (const child of node.parts ?? []) {
            visit(child);
        }
    };

    visit(part);
    return texts.filter(Boolean).join("\n\n").trim();
}

function normalizeKeyword(keyword: string) {
    return keyword.trim().toLowerCase();
}

function keywordMatches(text: string, keywords: string[]) {
    const normalized = text.toLowerCase();
    return keywords.find((keyword) => normalized.includes(keyword));
}

function buildGmailQuery(keywords: string[]) {
    return keywords.map((keyword) => `"${keyword.replace(/"/g, "")}"`).join(" OR ");
}

function hasExcludedKeyword(text: string, keywords: string[]) {
    const normalized = text.toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword));
}

function deriveCategory(match: string | undefined) {
    if (!match) {
        return "general";
    }

    if (["quote", "proposal", "estimate"].includes(match)) {
        return "proposal";
    }

    if (["appointment", "consultation", "booking"].includes(match)) {
        return "appointment";
    }

    if (match === "follow up") {
        return "follow_up";
    }

    return "service";
}

function getReceivedAt(dateHeader: string | null, internalDate: string | undefined) {
    if (dateHeader) {
        const parsedDate = new Date(dateHeader);
        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString();
        }
    }

    if (internalDate) {
        const parsedInternalDate = new Date(Number(internalDate));
        if (!Number.isNaN(parsedInternalDate.getTime())) {
            return parsedInternalDate.toISOString();
        }
    }

    return new Date().toISOString();
}

function formatSyncError(stage: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return `[gmail-sync:${stage}] ${message}`;
}

async function refreshAccessToken(env: WorkerEnv, connection: GmailConnection) {
    if (!connection.refresh_token) {
        throw new Error("Gmail connection is missing a refresh token");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            refresh_token: connection.refresh_token,
            grant_type: "refresh_token",
        }),
    });

    const tokenPayload = await tokenResponse.json<{
        access_token?: string;
        expires_in?: number;
        error?: string;
        error_description?: string;
    }>();

    if (!tokenResponse.ok || !tokenPayload.access_token) {
        throw new Error(tokenPayload.error_description ?? tokenPayload.error ?? "Failed to refresh Gmail access token");
    }

    return {
        accessToken: tokenPayload.access_token,
    };
}

async function ensureAccessToken(env: WorkerEnv, supabase: SupabaseClient<any>, connection: GmailConnection) {
    if (connection.access_token) {
        return connection.access_token;
    }

    const refreshed = await refreshAccessToken(env, connection);
    const { error } = await supabase
        .from("gmail_connections")
        .update({
            access_token: refreshed.accessToken,
            connected: true,
        })
        .eq("user_id", connection.user_id);

    if (error) {
        throw new Error(error.message);
    }

    return refreshed.accessToken;
}

async function fetchJson<T>(
    url: string,
    accessToken: string,
    options?: {
        env?: WorkerEnv;
        supabase?: SupabaseClient<any>;
        connection?: GmailConnection;
    },
) {
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401 && options?.env && options.supabase && options.connection?.refresh_token) {
        const refreshed = await refreshAccessToken(options.env, options.connection);
        const { error } = await options.supabase
            .from("gmail_connections")
            .update({
                access_token: refreshed.accessToken,
                connected: true,
            })
            .eq("user_id", options.connection.user_id);

        if (error) {
            throw new Error(error.message);
        }

        options.connection.access_token = refreshed.accessToken;
        response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${refreshed.accessToken}`,
            },
        });
    }

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json<T>();
}

async function loadEmailFilters(
    supabase: SupabaseClient<any>,
    organizationId: string,
    userId: string,
): Promise<EmailFilterSet> {
    const { data, error } = await supabase
        .from("email_filters")
        .select("id,keyword,filter_type,deleted")
        .eq("organization_id", organizationId)
        .eq("user_id", userId)
        .eq("deleted", false)
        .order("created_at", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    const filters = (data ?? []) as EmailFilterRecord[];
    const include = new Set<string>(FILTER_KEYWORDS.map((keyword) => normalizeKeyword(keyword)));
    const exclude = new Set<string>();

    for (const filter of filters) {
        const keyword = normalizeKeyword(filter.keyword ?? "");
        if (!keyword) {
            continue;
        }

        if (filter.filter_type === "include") {
            include.add(keyword);
            continue;
        }

        exclude.add(keyword);
    }

    return {
        include: [...include],
        exclude: [...exclude],
    };
}

async function saveEmails(
    supabase: SupabaseClient<any>,
    organizationId: string,
    userId: string,
    rows: Record<string, unknown>[],
) {
    const gmailMessageIds = rows
        .map((row) => row.gmail_message_id)
        .filter((gmailMessageId): gmailMessageId is string => typeof gmailMessageId === "string" && gmailMessageId.length > 0);

    if (gmailMessageIds.length === 0) {
        return;
    }

    const { data: existingEmails, error: existingEmailsError } = await supabase
        .from("emails")
        .select("id,gmail_message_id")
        .eq("organization_id", organizationId)
        .eq("user_id", userId)
        .in("gmail_message_id", gmailMessageIds);

    if (existingEmailsError) {
        throw new Error(existingEmailsError.message);
    }

    const existingByMessageId = new Map<string, string>();
    for (const email of (existingEmails ?? []) as ExistingEmailRecord[]) {
        if (email.id && email.gmail_message_id) {
            existingByMessageId.set(email.gmail_message_id, email.id);
        }
    }

    const rowsToInsert: Record<string, unknown>[] = [];

    for (const row of rows) {
        const gmailMessageId = typeof row.gmail_message_id === "string" ? row.gmail_message_id : null;
        const existingId = gmailMessageId ? existingByMessageId.get(gmailMessageId) : null;

        if (!existingId) {
            rowsToInsert.push(row);
            continue;
        }

        const { error: updateError } = await supabase
            .from("emails")
            .update(row)
            .eq("id", existingId);

        if (updateError) {
            throw new Error(updateError.message);
        }
    }

    if (rowsToInsert.length === 0) {
        return;
    }

    const { error: insertError } = await supabase
        .from("emails")
        .insert(rowsToInsert);

    if (insertError) {
        throw new Error(insertError.message);
    }
}

export async function syncGmailEmails({ env, organizationId, userId }: SyncGmailEmailsParams): Promise<SyncGmailEmailsResult> {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    let connection: GmailConnection | null = null;

    try {
        const { data, error: connectionError } = await supabase
            .from("gmail_connections")
            .select("id,user_id,email,access_token,refresh_token,expiry,connected")
            .eq("user_id", userId)
            .eq("connected", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (connectionError) {
            throw new Error(connectionError.message);
        }

        connection = data as GmailConnection | null;
    } catch (error) {
        throw new Error(formatSyncError("load-connection", error));
    }

    if (!connection) {
        throw new Error(formatSyncError("load-connection", "No active Gmail connection found for user"));
    }

    let filterSet: EmailFilterSet;
    try {
        filterSet = await loadEmailFilters(supabase, organizationId, userId);
    } catch (error) {
        throw new Error(formatSyncError("load-filters", error));
    }

    let accessToken: string;
    try {
        accessToken = await ensureAccessToken(env, supabase, connection as GmailConnection);
    } catch (error) {
        throw new Error(formatSyncError("ensure-access-token", error));
    }

    const query = encodeURIComponent(buildGmailQuery(filterSet.include));

    let listResponse: GmailListResponse;
    try {
        listResponse = await fetchJson<GmailListResponse>(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=${MAX_GMAIL_MESSAGES_PER_SYNC}`,
            accessToken,
            { env, supabase, connection: connection as GmailConnection },
        );
    } catch (error) {
        throw new Error(formatSyncError("list-messages", error));
    }

    const messageIds = listResponse.messages?.map((message) => message.id).filter(Boolean) ?? [];
    if (messageIds.length === 0) {
        return { synced: 0, matched: 0 };
    }

    let contacts: ContactRecord[] | null = null;
    try {
        const { data, error: contactsError } = await supabase
            .from("contacts")
            .select("id,email")
            .eq("organization_id", organizationId);

        if (contactsError) {
            console.error("Failed to load contacts for Gmail sync:", contactsError.message);
        } else {
            contacts = (data ?? []) as ContactRecord[];
        }
    } catch (error) {
        console.error("Failed to load contacts for Gmail sync:", error);
    }

    const contactByEmail = new Map<string, string>();
    for (const contact of contacts ?? []) {
        if (contact.email) {
            contactByEmail.set(contact.email.toLowerCase(), contact.id);
        }
    }

    const rowsToUpsert: Record<string, unknown>[] = [];
    let matchedCount = 0;

    for (const messageId of messageIds) {
        try {
            const message = await fetchJson<GmailMessageResponse>(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
                connection.access_token ?? accessToken,
                { env, supabase, connection: connection as GmailConnection },
            );

            if (isSpamLikeMessage(message)) {
                continue;
            }

            const headers = message.payload?.headers ?? [];
            const subject = decodeMimeHeader(getHeader(headers, "Subject"));
            const snippet = message.snippet ?? "";
            const body = collectBodyText(message.payload);
            const messageText = `${subject}\n${snippet}\n${body}`;
            const matchedKeyword = keywordMatches(messageText, filterSet.include);

            if (!matchedKeyword) {
                continue;
            }

            if (hasExcludedKeyword(messageText, filterSet.exclude)) {
                continue;
            }

            const sender = parseEmailAddress(getHeader(headers, "From"));
            const recipient = parseEmailAddress(getHeader(headers, "To"));

            if (isBlockedSender(sender.email)) {
                continue;
            }

            matchedCount += 1;

            const contactId =
                (sender.email ? contactByEmail.get(sender.email) : undefined) ??
                (recipient.email ? contactByEmail.get(recipient.email) : undefined) ??
                null;

            const receivedAt = getReceivedAt(getHeader(headers, "Date"), message.internalDate);
            const isRead = !message.labelIds?.includes("UNREAD");
            const isProposal = ["quote", "proposal", "estimate"].includes(matchedKeyword);
            const isReplyNeeded = !isRead && Boolean(sender.email && sender.email !== connection.email?.toLowerCase());

            rowsToUpsert.push({
                organization_id: organizationId,
                user_id: userId,
                contact_id: contactId,
                gmail_message_id: message.id,
                sender_email: sender.email,
                sender_name: sender.name,
                recipient_email: recipient.email,
                recipient_name: recipient.name,
                subject,
                snippet,
                body,
                category: deriveCategory(matchedKeyword),
                is_read: isRead,
                is_proposal: isProposal,
                is_reply_needed: isReplyNeeded,
                deleted: false,
                received_at: receivedAt,
                created_at: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Failed to process Gmail message", messageId, error);
            continue;
        }
    }

    if (rowsToUpsert.length === 0) {
        return { synced: 0, matched: 0 };
    }

    try {
        await saveEmails(supabase, organizationId, userId, rowsToUpsert);
    } catch (error) {
        throw new Error(formatSyncError("save-emails", error));
    }

    return {
        synced: rowsToUpsert.length,
        matched: matchedCount,
    };
}

export async function syncConnectedGmailAccounts(env: WorkerEnv): Promise<BackgroundSyncResult> {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: connections, error: connectionsError } = await supabase
        .from("gmail_connections")
        .select("user_id")
        .eq("connected", true)
        .order("created_at", { ascending: false });

    if (connectionsError) {
        throw new Error(connectionsError.message);
    }

    const userIds = Array.from(
        new Set(
            (connections ?? [])
                .map((connection) => (connection as { user_id?: string }).user_id)
                .filter((userId): userId is string => Boolean(userId))
        )
    );

    if (userIds.length === 0) {
        return {
            processedUsers: 0,
            syncedEmails: 0,
            matchedEmails: 0,
            failures: [],
        };
    }

    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id,organization_id")
        .in("id", userIds);

    if (profilesError) {
        throw new Error(profilesError.message);
    }

    const organizationByUserId = new Map<string, string>();
    for (const profile of profiles ?? []) {
        const row = profile as { id?: string; organization_id?: string };
        if (row.id && row.organization_id) {
            organizationByUserId.set(row.id, row.organization_id);
        }
    }

    let syncedEmails = 0;
    let matchedEmails = 0;
    let processedUsers = 0;
    const failures: BackgroundSyncResult["failures"] = [];

    for (const userId of userIds) {
        const organizationId = organizationByUserId.get(userId);
        if (!organizationId) {
            failures.push({
                userId,
                error: "User organization not found",
            });
            continue;
        }

        try {
            const result = await syncGmailEmails({
                env,
                organizationId,
                userId,
            });

            processedUsers += 1;
            syncedEmails += result.synced;
            matchedEmails += result.matched;
        } catch (error) {
            failures.push({
                userId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    return {
        processedUsers,
        syncedEmails,
        matchedEmails,
        failures,
    };
}
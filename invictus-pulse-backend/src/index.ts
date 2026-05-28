import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { verifyUser } from "./auth";
import { createClient } from '@supabase/supabase-js'
import { getActiveClientsForOrg } from "./services/activeClients";
import { getNewLeadsThisMonthForOrg } from "./services/newLeads";
import { searchPlacesAll } from "./services/places";
import { savePlacesToDB } from "./services/leads";
import { syncConnectedGmailAccounts, syncGmailEmails, type WorkerEnv } from "./services/gmailSync";
import { cors } from "hono/cors";
import * as dotenv from "dotenv";

const GOOGLE_REDIRECT_URI = "https://invictus-pulse-backend.invictuspulse.workers.dev/auth/callback";

type GoogleTokenResponse = {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string;
	token_type?: string;
	error?: string;
	error_description?: string;
};

type GoogleProfileResponse = {
	emailAddress?: string;
};

type GoogleUserInfoResponse = {
	email?: string;
};

type OAuthStatePayload = {
	userId: string;
	returnTo?: string;
	expiresAt: number;
};

const encoder = new TextEncoder();

function toBase64Url(value: string) {
	return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padding = (4 - (normalized.length % 4)) % 4;
	return atob(normalized + "=".repeat(padding));
}

async function signOAuthState(payload: OAuthStatePayload, secret: string) {
	const body = toBase64Url(JSON.stringify(payload));
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
	const signature = toBase64Url(String.fromCharCode(...new Uint8Array(signatureBuffer)));

	return `${body}.${signature}`;
}

async function verifyOAuthState(state: string, secret: string) {
	const [encodedPayload, encodedSignature] = state.split(".");
	if (!encodedPayload || !encodedSignature) {
		throw new Error("Invalid OAuth state");
	}

	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["verify"]
	);
	const isValid = await crypto.subtle.verify(
		"HMAC",
		key,
		Uint8Array.from(fromBase64Url(encodedSignature), (char) => char.charCodeAt(0)),
		encoder.encode(encodedPayload)
	);

	if (!isValid) {
		throw new Error("Invalid OAuth state signature");
	}

	const payload = JSON.parse(fromBase64Url(encodedPayload)) as OAuthStatePayload;
	if (!payload.userId || !payload.expiresAt || payload.expiresAt < Date.now()) {
		throw new Error("OAuth state expired");
	}

	return payload;
}

async function fetchGoogleEmailAddress(accessToken: string) {
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
		headers,
	});

	if (userInfoResponse.ok) {
		const userInfo = await userInfoResponse.json<GoogleUserInfoResponse>();
		if (userInfo.email) {
			return userInfo.email;
		}
	}

	const gmailProfileResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
		headers,
	});

	if (gmailProfileResponse.ok) {
		const profile = await gmailProfileResponse.json<GoogleProfileResponse>();
		if (profile.emailAddress) {
			return profile.emailAddress;
		}
	}

	const userInfoError = userInfoResponse.ok ? "userinfo endpoint returned no email" : await userInfoResponse.text();
	const gmailProfileError = gmailProfileResponse.ok ? "gmail profile endpoint returned no emailAddress" : await gmailProfileResponse.text();

	throw new Error(`Failed to fetch Google email address. userinfo: ${userInfoError}; gmail profile: ${gmailProfileError}`);
}

const app = new Hono<{ Bindings: Env }>();

app.use(
	"*",
	cors({
		origin: "http://localhost:8080",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	})
);

app.options("*", (c) => {
	return c.body(null, 204);
});

dotenv.config();

// Contacts API
app.get("/contacts", async (c) => {
	try {
		const user = await verifyUser(c.req.raw, c.env);
		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY
		);

		const { data } = await supabase
			.from("contacts")
			.select("*")
			.eq("user_id", user.id);

		return c.json(data);
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage }, { status: 401 });
	}
});

app.post("/contacts", async (c) => {
	try {

		const user = await verifyUser(c.req.raw, c.env);
		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY
		);

		const body = await c.req.json();

		await supabase.from("contacts").insert({
			user_id: user.id,
			name: body.name,
			email: body.email,
			phone: body.phone,
		});

		return c.json({ success: true });
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage }, { status: 401 });
	}
});

const scheduled = async (event: any, env: any, ctx?: ExecutionContext) => {
	try {
		const run = syncConnectedGmailAccounts(env).then((result) => {
			console.log("Scheduled Gmail sync completed", {
				cron: event?.cron,
				processedUsers: result.processedUsers,
				syncedEmails: result.syncedEmails,
				matchedEmails: result.matchedEmails,
				failures: result.failures,
			});
		});

		if (ctx) {
			ctx.waitUntil(run);
			return;
		}

		await run;
	} catch (error: any) {
		console.error("Error in scheduled task:", error.message);
	}
};

app.get("/analytics/active-clients", async (c) => {
	const organizationId = c.req.query("org");

	if (!organizationId) {
		return c.json({ error: "orgId required" }, 400);
	}

	const total = await getActiveClientsForOrg(c.env, organizationId);

	return c.json({
		activeClients: total
	});

});

app.get("/analytics/new-clients", async (c) => {
	const orgId = c.req.query("org");

	if (!orgId) {
		return c.json({ error: "orgId required" }, 400);
	}

	const newClients = await getNewLeadsThisMonthForOrg(c.env, orgId);

	return c.json({
		newClientsThisMonth: newClients,
	});
});

app.get("/auth/google", async (c) => {
	let state: string | null = null;

	try {
		const clientId = c.env.GOOGLE_CLIENT_ID;
		const redirectUri = GOOGLE_REDIRECT_URI;
		const userId = c.req.query("userId");
		const returnTo = c.req.query("returnTo");
		const debug = c.req.query("debug");

		if (!userId) {
			return c.json({ error: "Missing userId for OAuth state", code: null, state, userId }, 400);
		}

		state = await signOAuthState(
			{
				userId,
				returnTo: returnTo || undefined,
				expiresAt: Date.now() + 10 * 60 * 1000,
			},
			c.env.GOOGLE_CLIENT_SECRET
		);

		const url =
			"https://accounts.google.com/o/oauth2/v2/auth?" +
			new URLSearchParams({
				client_id: clientId,
				redirect_uri: redirectUri,
				response_type: "code",
				scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.readonly"].join(" "),
				access_type: "offline",
				prompt: "consent",
				state,
			});

		if (debug === "1") {
			return c.json({ code: null, state, url, userId });
		}

		return c.redirect(url);
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage, code: null, state }, 401);
	}
});

app.get("/auth/google/status", async (c) => {
	try {
		const user = await verifyUser(c.req.raw, c.env);
		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY
		);

		const { data, error } = await supabase
			.from("gmail_connections")
			.select("connected,access_token,refresh_token")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false })
			.limit(1);

		if (error) {
			return c.json({ error: error.message }, 500);
		}

		const connection = data?.[0];
		const connected = Boolean(connection?.connected && (connection?.access_token || connection?.refresh_token));

		return c.json({ connected });
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage }, 401);
	}
});

app.post("/auth/google/disconnect", async (c) => {
	try {
		const user = await verifyUser(c.req.raw, c.env);
		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY
		);

		const { error } = await supabase
			.from("gmail_connections")
			.update({ connected: false })
			.eq("user_id", user.id)
			.eq("connected", true);

		if (error) {
			return c.json({ error: error.message }, 500);
		}

		return c.json({ success: true, connected: false });
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage }, 401);
	}
});

app.post("/gmail/sync", async (c) => {
	try {
		const user = await verifyUser(c.req.raw, c.env);
		const result = await syncGmailEmails({
			env: c.env as WorkerEnv,
			organizationId: user.organization_id,
			userId: user.id,
		});

		return c.json({
			success: true,
			...result,
		});
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage }, 500);
	}
});

app.get("/auth/callback", async (c) => {
	const code = c.req.query("code");
	const state = c.req.query("state");

	try {
		if (!code || !state) {
			return c.json({ error: "Missing OAuth callback parameters", code, state }, 400);
		}

		const { userId, returnTo } = await verifyOAuthState(state, c.env.GOOGLE_CLIENT_SECRET);
		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY
		);

		const { data: existingConnection } = await supabase
			.from("gmail_connections")
			.select("id,refresh_token")
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				code,
				client_id: c.env.GOOGLE_CLIENT_ID,
				client_secret: c.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: GOOGLE_REDIRECT_URI,
				grant_type: "authorization_code",
			}),
		});

		const tokens = await tokenRes.json<GoogleTokenResponse>();

		if (!tokenRes.ok || !tokens.access_token) {
			return c.json({ error: tokens.error_description ?? tokens.error ?? "Failed to exchange Google OAuth code", code, state }, 400);
		}

		const emailAddress = await fetchGoogleEmailAddress(tokens.access_token);
		const connectedAt = new Date();
		const expiresAt = new Date(connectedAt);
		expiresAt.setFullYear(expiresAt.getFullYear() + 1);
		const refreshToken = tokens.refresh_token ?? existingConnection?.refresh_token ?? null;

		const connectionPayload = {
			user_id: userId,
			email: emailAddress,
			access_token: tokens.access_token,
			refresh_token: refreshToken,
			connected: true,
			expiry: expiresAt.toISOString(),
			created_at: connectedAt.toISOString(),
		};

		const { error } = existingConnection?.id
			? await supabase
				.from("gmail_connections")
				.update(connectionPayload)
				.eq("id", existingConnection.id)
			: await supabase
				.from("gmail_connections")
				.insert(connectionPayload);

		if (error) {
			return c.json({ error: error.message, code, state }, 500);
		}

		const redirectTarget = returnTo || "http://localhost:8080/dashboard/settings";

		return c.redirect(redirectTarget);
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: errorMessage, code, state }, 400);
	}
});

app.post("/search", async (c) => {
	try {
		const user = await verifyUser(c.req.raw, c.env);
		const { query } = await c.req.json();

		if (!query) {
			return c.json({ error: "Missing query" }, 400);
		}

		const places = await searchPlacesAll(query, c.env.GOOGLE_PLACES_API_KEY);

		const savedCount = await savePlacesToDB(
			c.env,
			user.organization_id,
			user.id,
			places
		);

		return c.json({
			success: true,
			found: places.length,
			saved: savedCount
		});

	} catch (err: any) {
		return c.json({ error: err.message }, 500);
	}
});

// OpenAPI
const openapi = fromHono(app, { docs_url: "/" });

openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

export { scheduled };

export default {
	fetch: app.fetch,
	scheduled,
};
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessagesPage } from "../shared/MessagesPage";

const GMAIL_SYNC_URL = "*********/gmail/sync";
const GOOGLE_STATUS_URL = "*********/auth/google/status";

type EmailRow = {
  id: string;
  sender_name: string | null;
  sender_email: string | null;
  subject: string | null;
  snippet: string | null;
  body: string | null;
  is_read: boolean | null;
  received_at: string | null;
};

function formatMessageTimestamp(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function UnifiedMessagesPage() {
  const { orgId, session } = useAuth();
  const [messages, setMessages] = useState<Array<{
    id: string;
    contact: string;
    avatar: string;
    subject: string;
    preview: string;
    body: string;
    timestamp: string;
    channel: "email";
    unread: boolean;
    starred: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = async () => {
    if (!supabase || !orgId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const query = await supabase
      .from("emails" as never)
      .select("id,sender_name,sender_email,subject,snippet,body,is_read,received_at" as never)
      .eq("organization_id", orgId)
      .or("deleted.is.null,deleted.eq.false")
      .order("received_at", { ascending: false, nullsFirst: false });

    const { data, error } = query as {
      data: EmailRow[] | null;
      error: { message: string } | null;
    };

    if (error) {
      console.error("Failed to load messages:", error.message);
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setMessages(
      (data ?? []).map((message) => {
        const contact = message.sender_name || message.sender_email || "Unknown sender";
        return {
          id: message.id,
          contact,
          avatar: contact.charAt(0).toUpperCase() || "?",
          subject: message.subject || "",
          preview: message.snippet || "",
          body: message.body || "",
          timestamp: formatMessageTimestamp(message.received_at),
          channel: "email" as const,
          unread: !message.is_read,
          starred: false,
        };
      })
    );
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    if (!session?.access_token) {
      toast({
        title: "Unable to refresh messages",
        description: "Please sign in again before syncing Gmail messages.",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);

    try {
      const statusResponse = await fetch(GOOGLE_STATUS_URL, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const statusText = await statusResponse.text();
      const statusPayload = statusText ? JSON.parse(statusText) as {
        error?: string;
        connected?: boolean;
      } : {};

      if (!statusResponse.ok) {
        throw new Error(statusPayload.error ?? "Failed to load Gmail connection status");
      }

      if (!statusPayload.connected) {
        toast({
          title: "Gmail not connected",
          description: "Connect your Gmail account in Settings before refreshing messages.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(GMAIL_SYNC_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const responseText = await response.text();
      const payload = responseText ? JSON.parse(responseText) as {
        error?: string;
        synced?: number;
        matched?: number;
      } : {};

      if (!response.ok) {
        console.error("Gmail sync failed", {
          status: response.status,
          payload,
          raw: responseText,
        });
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to refresh Gmail messages");
      }

      await loadMessages();

      toast({
        title: "Messages refreshed",
        description: `Synced ${payload.synced ?? 0} email(s) with ${payload.matched ?? 0} match(es).`,
      });
    } catch (error) {
      toast({
        title: "Unable to refresh messages",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!supabase || !orgId) {
      toast({
        title: "Unable to delete message",
        description: "Database connection unavailable.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    const { error } = await supabase
      .from("emails" as never)
      .update({ deleted: true } as never)
      .eq("id", messageId)
      .eq("organization_id", orgId);

    setIsDeleting(false);

    if (error) {
      toast({
        title: "Unable to delete message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessages((currentMessages) => currentMessages.filter((message) => message.id !== messageId));
    toast({
      title: "Message deleted",
      description: "The message was removed from your dashboard.",
    });
  };

  useEffect(() => {
    let mounted = true;

    const runLoadMessages = async () => {
      await loadMessages();
      if (!mounted) {
        return;
      }
    };

    void runLoadMessages();

    return () => {
      mounted = false;
    };
  }, [orgId]);

  return (
    <DashboardLayout>
      <MessagesPage
        messages={messages}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isDeleting={isDeleting}
        onDeleteMessage={(messageId) => void handleDeleteMessage(messageId)}
        onRefresh={() => void handleRefresh()}
      />
    </DashboardLayout>
  );
}

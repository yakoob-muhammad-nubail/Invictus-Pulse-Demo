import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Star,
  Archive,
  MoreHorizontal,
  Trash2,
  Send,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  contact: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  channel: "email" | "sms" | "call";
  unread: boolean;
  starred: boolean;
}

interface MessagesPageProps {
  messages: Message[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  isDeleting?: boolean;
  onDeleteMessage?: (messageId: string) => void;
  onRefresh?: () => void;
}

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
};

const channelColors = {
  email: "text-blue-500",
  sms: "text-green-500",
  call: "text-orange-500",
};

export function MessagesPage({
  messages,
  isLoading = false,
  isRefreshing = false,
  isDeleting = false,
  onDeleteMessage,
  onRefresh,
}: MessagesPageProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(messages[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  useEffect(() => {
    if (messages.length === 0) {
      setSelectedMessage(null);
      return;
    }

    setSelectedMessage((currentSelection) => {
      if (!currentSelection) {
        return messages[0];
      }

      const nextSelection = messages.find((message) => message.id === currentSelection.id);
      return nextSelection ?? messages[0];
    });
  }, [messages]);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && msg.unread) ||
      (filter === "starred" && msg.starred);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Message List */}
      <div className="w-96 flex flex-col border border-border rounded-xl bg-card">
        {/* Search & Filters */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Messages</h2>
              <p className="text-xs text-muted-foreground">Emails, messages, and calls</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={!onRefresh || isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "unread", "starred"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(f)}
                className="text-xs"
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredMessages.map((message, index) => {
              const ChannelIcon = channelIcons[message.channel];
              return (
                <motion.button
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedMessage(message)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-colors mb-1",
                    selectedMessage?.id === message.id
                      ? "bg-primary/10"
                      : "hover:bg-muted/50",
                    message.unread && "bg-muted/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-medium">
                        {message.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("font-medium truncate", message.unread && "text-primary")}>
                          {message.contact}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.subject || message.preview}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ChannelIcon className={cn("h-3 w-3", channelColors[message.channel])} />
                        {message.starred && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                        {message.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {!isLoading && filteredMessages.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No messages found.</p>
              </div>
            )}

            {isLoading && (
              <div className="p-8 text-center text-muted-foreground">
                <p>Loading messages...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col border border-border rounded-xl bg-card">
        {selectedMessage ? (
          <>
            {/* Message Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-medium text-lg">
                    {selectedMessage.avatar}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{selectedMessage.contact}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {selectedMessage.channel.toUpperCase()}
                    </Badge>
                    <span>{selectedMessage.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Star className={cn("h-4 w-4", selectedMessage.starred && "fill-yellow-500 text-yellow-500")} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onDeleteMessage?.(selectedMessage.id)}
                      disabled={!onDeleteMessage || isDeleting}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Message Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 max-w-2xl">
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedMessage.contact} • {selectedMessage.timestamp}
                  </p>
                  <h3 className="font-medium mb-3">{selectedMessage.subject || "No subject"}</h3>
                  <p>{selectedMessage.body || selectedMessage.preview}</p>
                </div>
              </div>
            </ScrollArea>

            {/* Reply Box */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Type your reply..."
                  className="min-h-20 resize-none"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a message to view</p>
          </div>
        )}
      </div>
    </div>
  );
}

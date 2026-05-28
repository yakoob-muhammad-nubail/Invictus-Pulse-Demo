import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Palette,
  Save,
  Sun,
  Moon,
  Monitor,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

interface SettingsPageProps {
  industryLabel: string;
}

const GOOGLE_AUTH_URL = "https://invictus-pulse-backend.invictuspulse.workers.dev/auth/google";
const GOOGLE_STATUS_URL = "https://invictus-pulse-backend.invictuspulse.workers.dev/auth/google/status";
const GOOGLE_DISCONNECT_URL = "https://invictus-pulse-backend.invictuspulse.workers.dev/auth/google/disconnect";

export function SettingsPage({ industryLabel }: SettingsPageProps) {
  const { user, session, updateUser, orgId } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [filtersSaving, setFiltersSaving] = useState(false);

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [phone, setPhone] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleServices, setGoogleServices] = useState({ calendar: true, gmail: true, meet: false });

  // Email filter state
  const [emailFilters, setEmailFilters] = useState<{ id: string; keyword: string; mode: "include" | "exclude"; persisted: boolean }[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newMode, setNewMode] = useState<"include" | "exclude">("include");

  const handleAddFilter = () => {
    if (!newKeyword.trim()) return;
    setEmailFilters((prev) => [
      ...prev,
      { id: crypto.randomUUID(), keyword: newKeyword.trim(), mode: newMode, persisted: false },
    ]);
    setNewKeyword("");
  };

  const handleRemoveFilter = async (id: string) => {
    const filter = emailFilters.find((f) => f.id === id);

    if (filter?.persisted) {
      if (!supabase) {
        toast({ title: "Failed to delete filter", description: "Database connection unavailable.", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from("email_filters")
        .update({ deleted: true, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        toast({ title: "Failed to delete filter", description: error.message, variant: "destructive" });
        return;
      }
    }

    setEmailFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateFilterMode = (id: string, mode: "include" | "exclude") => {
    setEmailFilters((prev) => prev.map((f) => (f.id === id ? { ...f, mode } : f)));
  };

  const handleSaveFilters = async () => {
    if (!supabase) {
      toast({ title: "Error", description: "Database connection unavailable.", variant: "destructive" });
      return;
    }
    if (!orgId || !user?.id) {
      toast({ title: "Error", description: "Unable to determine your organization or user.", variant: "destructive" });
      return;
    }

    setFiltersSaving(true);

    const now = new Date().toISOString();
    const rows = emailFilters.map((f) => ({
      id: f.id,
      organization_id: orgId,
      user_id: user.id,
      keyword: f.keyword,
      filter_type: f.mode === "include" ? "include" : "do not include",
      deleted: false,
      created_at: now,
      updated_at: now,
    }));

    const { error } = await supabase.from("email_filters").upsert(rows, { onConflict: "id" });

    setFiltersSaving(false);

    if (error) {
      toast({ title: "Failed to save filters", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Filters saved", description: `${emailFilters.length} keyword filter(s) saved.` });
    setEmailFilters((prev) => prev.map((f) => ({ ...f, persisted: true })));
  };

  useEffect(() => {
    if (!supabase || !orgId || !user?.id) {
      setEmailFilters([]);
      return;
    }

    let active = true;

    const loadEmailFilters = async () => {
      const { data, error } = await supabase
        .from("email_filters")
        .select("id, keyword, filter_type")
        .eq("organization_id", orgId)
        .eq("user_id", user.id)
        .eq("deleted", false)
        .order("created_at", { ascending: true });

      if (error) {
        if (active) {
          toast({ title: "Failed to load filters", description: error.message, variant: "destructive" });
        }
        return;
      }

      if (!active) {
        return;
      }

      setEmailFilters(
        (data ?? []).map((filter) => ({
          id: filter.id,
          keyword: filter.keyword,
          mode: filter.filter_type === "include" ? "include" : "exclude",
          persisted: true,
        })),
      );
    };

    void loadEmailFilters();

    return () => {
      active = false;
    };
  }, [orgId, user?.id]);

  useEffect(() => {
    if (!session?.access_token) {
      setGoogleConnected(false);
      return;
    }

    let mounted = true;

    const loadGoogleConnectionStatus = async () => {
      try {
        const res = await fetch(GOOGLE_STATUS_URL, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load Google connection status");
        }

        if (mounted) {
          setGoogleConnected(Boolean(data.connected));
        }
      } catch (error) {
        console.error("Failed to load Google connection status:", error);
      }
    };

    void loadGoogleConnectionStatus();

    return () => {
      mounted = false;
    };
  }, [session?.access_token]);

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateUser({ name, businessName });
    setSaving(false);
    toast({
      title: "Settings saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleGoogleAuthClick = async () => {
    if (googleConnected) {
      if (!session?.access_token) {
        toast({
          title: "Unable to disconnect Google",
          description: "Please sign in again before disconnecting Google authentication.",
          variant: "destructive",
        });
        return;
      }

      try {
        const res = await fetch(GOOGLE_DISCONNECT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to disconnect Google");
        }

        setGoogleConnected(false);
        toast({
          title: "Google disconnected",
          description: "Your Google account has been disconnected.",
        });
      } catch (error) {
        toast({
          title: "Unable to disconnect Google",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }

      return;
    }

    if (!user?.id) {
      toast({
        title: "Unable to connect Google",
        description: "Please sign in again before starting Google authentication.",
        variant: "destructive",
      });
      return;
    }

    const authUrl = new URL(GOOGLE_AUTH_URL);
    authUrl.searchParams.set("userId", user.id);
    authUrl.searchParams.set("returnTo", `${window.location.origin}${location.pathname}`);
    window.location.href = authUrl.toString();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and {industryLabel.toLowerCase()} preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="filter-emails" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter Emails
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-6"
          >
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Update your personal details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="est">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                    <SelectItem value="cst">Central Time (CST)</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Your business details for {industryLabel.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={industryLabel}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-6"
          >
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose how you want to be notified
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via text message
                    </p>
                  </div>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Browser push notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={dailyDigest}
                  onCheckedChange={setDailyDigest}
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Google Auth Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-6 w-6">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Google Account</h2>
                    <p className="text-sm text-muted-foreground">
                      {googleConnected ? "Connected — manage your Google services below" : "Connect your Google account to enable integrations"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={googleConnected ? "outline" : "default"}
                  onClick={handleGoogleAuthClick}
                >
                  {googleConnected ? "Disconnect" : "Connect with Google"}
                </Button>
              </div>

              {googleConnected && (
                <div className="space-y-4 pt-2">
                  <Separator />
                  {[
                    { name: "Google Calendar", description: "Sync your calendar events", key: "calendar" as const },
                    { name: "Gmail", description: "Read and send emails from your inbox", key: "gmail" as const },
                    { name: "Google Meet", description: "Create and join video meetings", key: "meet" as const },
                  ].map((service) => (
                    <div
                      key={service.key}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <Switch
                        checked={googleServices[service.key]}
                        onCheckedChange={(checked) =>
                          setGoogleServices((prev) => ({ ...prev, [service.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Other Communication Channels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 space-y-6"
            >
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Channels
                </h2>
                <p className="text-sm text-muted-foreground">
                  Connect your communication platforms
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: MessageSquare, name: "WhatsApp Business", connected: false },
                  { icon: Phone, name: "Call Tracking", connected: false },
                  { icon: MessageSquare, name: "SMS (Twilio)", connected: true },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <integration.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integration.connected ? "outline" : "default"}
                      size="sm"
                    >
                      {integration.connected ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Filter Emails Tab */}
        <TabsContent value="filter-emails">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-6"
          >
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Emails
              </h2>
              <p className="text-sm text-muted-foreground">
                Add keywords to include or exclude emails from being captured.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px_auto] gap-3 items-end">
              <div className="space-y-2">
                <Label htmlFor="new-keyword">Keyword</Label>
                <Input
                  id="new-keyword"
                  placeholder="e.g. invoice"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFilter();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Filter</Label>
                <Select value={newMode} onValueChange={(v) => setNewMode(v as "include" | "exclude")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="include">Include</SelectItem>
                    <SelectItem value="exclude">Do not include</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddFilter} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-[1fr_200px_auto] gap-3 px-3 text-sm font-semibold text-muted-foreground">
              <div>Keywords</div>
              <div>Filter</div>
              <div className="w-10 text-right">Action</div>
            </div>

            <div className="space-y-2">
              {emailFilters.length === 0 ? (
                <p className="text-sm text-muted-foreground italic px-3 py-6 text-center border border-dashed border-border rounded-lg">
                  No keywords added yet.
                </p>
              ) : (
                emailFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="grid grid-cols-[1fr_200px_auto] gap-3 items-center p-3 rounded-lg border border-border bg-background/50"
                  >
                    <div className="font-medium truncate">{filter.keyword}</div>
                    <Select
                      value={filter.mode}
                      onValueChange={(v) => handleUpdateFilterMode(filter.id, v as "include" | "exclude")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="include">Include</SelectItem>
                        <SelectItem value="exclude">Do not include</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleRemoveFilter(filter.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete keyword"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => void handleSaveFilters()} className="gap-2" disabled={filtersSaving}>
                <Save className="h-4 w-4" />
                {filtersSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-6"
          >
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your account security
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">
                      1 active session
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Sessions
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-6"
          >
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose your preferred appearance
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Light Mode</p>
                  <p className="text-xs text-muted-foreground">Clean and bright interface</p>
                </div>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <Moon className="h-6 w-6 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                </div>
              </button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

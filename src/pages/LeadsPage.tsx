import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Loader2, RefreshCw, Search, X, StickyNote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { runLeadSearch } from "@/api/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Lead = {
  id: string;
  business_name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  missing_website: boolean | null;
  google_url: string | null;
  stage: string | null;
  notes: string | null;
};

const STAGES = ["new", "contacted", "interested", "follow_up", "closed", "not_interested"] as const;

const stageColor: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-yellow-500/10 text-yellow-500",
  interested: "bg-green-500/10 text-green-500",
  follow_up: "bg-purple-500/10 text-purple-500",
  closed: "bg-emerald-500/10 text-emerald-500",
  not_interested: "bg-muted text-muted-foreground",
};

export default function LeadsPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [addressLead, setAddressLead] = useState<Lead | null>(null);
  const [nameLead, setNameLead] = useState<Lead | null>(null);

  const { orgId, session } = useAuth();

  const fetchLeads = async () => {
    if (!orgId) return;

    setLoading(true);

    const { data, error } = (await supabase
      .from("leads" as never)
      .select("*")
      .eq("user_id", session?.user.id)
      .order("created_at", { ascending: false })) as unknown as {
        data: Lead[] | null;
        error: { message: string } | null;
      };

    if (error) {
      console.error(error);
      toast({
        title: "Failed to load leads",
        description: error.message,
        variant: "destructive",
      });
      setLeads([]);
    } else {
      setLeads((data as Lead[]) || []);
    }

    setLoading(false);
  };

  // 🔹 Run Google Places search via Worker
  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();
    const trimmedLocation = location.trim();

    if (!session || !trimmedKeyword || !trimmedLocation) return;

    setSearching(true);

    try {
      await runLeadSearch(`${trimmedKeyword} ${trimmedLocation}`, session.access_token);
      await fetchLeads();
    } catch (err) {
      console.error("Search failed:", err);
      toast({
        title: "Search failed",
        description: err instanceof Error ? err.message : "Unable to refresh leads after search.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!orgId) return;

    fetchLeads();
  }, [orgId]);

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    if (!supabase) return;
    setSavingId(id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    const { error } = await supabase.from("leads" as never).update(patch as never).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      void fetchLeads();
    }
    setSavingId(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Businesses pulled from Google Places — track outreach status here.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex items-end gap-3 mb-6">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Keyword</label>
            <Input
              placeholder="e.g. plumbing, dentist..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
            <Input
              placeholder="e.g. Toronto, ON"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button className="h-10" onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            {searching ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Lead #</TableHead>
                <TableHead className="w-[160px]">Business</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Google</TableHead>
                <TableHead className="w-[180px]">Stage</TableHead>
                <TableHead className="w-[280px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin inline text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No leads yet. Run your bot to populate the `leads` table.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead, idx) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
                    <TableCell
                      className="font-medium max-w-[160px] truncate cursor-pointer hover:text-primary hover:underline transition-colors"
                      onClick={() => setNameLead(lead)}
                      title="Click to view full name"
                    >
                      {lead.business_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.phone || "—"}</TableCell>
                    <TableCell
                      className="text-muted-foreground text-sm max-w-[220px] truncate cursor-pointer hover:text-primary hover:underline transition-colors"
                      onClick={() => lead.address && setAddressLead(lead)}
                      title={lead.address ? "Click to view full address" : undefined}
                    >
                      {lead.address || "—"}
                    </TableCell>
                    <TableCell>
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline text-sm"
                        >
                          Visit
                        </a>
                      ) : (
                        <Badge variant="destructive">No Site</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.google_url ? (
                        <a
                          href={lead.google_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.stage ?? "new"}
                        onValueChange={(v) => updateLead(lead.id, { stage: v })}
                      >
                        <SelectTrigger className={`h-8 ${stageColor[lead.stage ?? "new"]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full justify-start text-left font-normal"
                        onClick={() => {
                          setNotesLead(lead);
                          setNotesDraft(lead.notes ?? "");
                        }}
                      >
                        <StickyNote className="h-3.5 w-3.5 mr-2 shrink-0" />
                        <span className="truncate text-muted-foreground">
                          {lead.notes?.trim() ? lead.notes : "Add notes..."}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={!!notesLead}
        onOpenChange={(open) => {
          if (!open) setNotesLead(null);
        }}
      >
        <DialogContent className="sm:max-w-sm data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out">
          <DialogHeader>
            <DialogTitle>Notes — {notesLead?.business_name}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Write notes about this lead..."
            className="min-h-[200px]"
            autoFocus
          />
        <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setNotesLead(null)} disabled={savingNotes}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
            <Button
              onClick={async () => {
                if (!notesLead) return;
                setSavingNotes(true);
                await updateLead(notesLead.id, { notes: notesDraft });
                setSavingNotes(false);
                setNotesLead(null);
              }}
              disabled={savingNotes}
            >
              {savingNotes && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Address popup */}
      <Dialog
        open={!!addressLead}
        onOpenChange={(open) => {
          if (!open) setAddressLead(null);
        }}
      >
        <DialogContent className="sm:max-w-lg data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out">
          <DialogHeader>
            <DialogTitle>Address — {addressLead?.business_name}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
            {addressLead?.address || "No address available"}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setAddressLead(null)}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Name popup */}
      <Dialog
        open={!!nameLead}
        onOpenChange={(open) => {
          if (!open) setNameLead(null);
        }}
      >
        <DialogContent className="sm:max-w-sm data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out">
          <DialogHeader>
            <DialogTitle>Business Name</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
            {nameLead?.business_name || "No name available"}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setNameLead(null)}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

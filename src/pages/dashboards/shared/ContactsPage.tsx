import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MoreHorizontal,
  Building,
  MapPin,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
  status: "lead" | "active" | "inactive";
  tags: string[];
  lastContact: string;
}

interface ContactsPageProps {
  industryLabel: string;
  mockContacts: Contact[];
}

const statusColors = {
  lead: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  active: "bg-green-500/20 text-green-500 border-green-500/30",
  inactive: "bg-muted text-muted-foreground border-muted",
};

export function ContactsPage({ industryLabel, mockContacts }: ContactsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contacts] = useState<Contact[]>(mockContacts);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your {industryLabel.toLowerCase()} contacts
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="lead">Leads</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      {contact.company && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {contact.company}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {contact.email}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {contact.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {contact.location}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusColors[contact.status]}
                  >
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {contact.lastContact}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        {filteredContacts.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <p>No contacts found matching your criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{filteredContacts.length}</strong> contacts
        </span>
        <span>
          <strong className="text-foreground">
            {contacts.filter((c) => c.status === "lead").length}
          </strong>{" "}
          leads
        </span>
        <span>
          <strong className="text-foreground">
            {contacts.filter((c) => c.status === "active").length}
          </strong>{" "}
          active
        </span>
      </div>
    </div>
  );
}

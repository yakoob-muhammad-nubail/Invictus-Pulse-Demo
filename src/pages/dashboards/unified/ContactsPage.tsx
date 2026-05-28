import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ContactsPage } from "../shared/ContactsPage";

const contacts = [
  { id: "1", name: "Alexandra Peters", email: "alex@petersco.com", phone: "(555) 111-0001", company: "Peters & Co", location: "Toronto, ON", status: "active" as const, tags: ["Strategy", "Enterprise"], lastContact: "Today" },
  { id: "2", name: "Benjamin Hayes", email: "ben@hayes.com", phone: "(555) 222-0002", company: "Hayes Ventures", location: "Vancouver, BC", status: "lead" as const, tags: ["Finance", "Startup"], lastContact: "Yesterday" },
  { id: "3", name: "Charlotte Moore", email: "charlotte@moore.com", phone: "(555) 333-0003", location: "Calgary, AB", status: "active" as const, tags: ["Executive Coaching"], lastContact: "3 days ago" },
  { id: "4", name: "Daniel Scott", email: "daniel@scott.com", phone: "(555) 444-0004", company: "Scott Industries", location: "Ottawa, ON", status: "inactive" as const, tags: ["Operations"], lastContact: "1 month ago" },
  { id: "5", name: "Eleanor Wright", email: "eleanor@wright.com", phone: "(555) 555-0005", company: "Wright Tech", location: "Montreal, QC", status: "lead" as const, tags: ["Digital Transformation"], lastContact: "1 week ago" },
];

export default function UnifiedContactsPage() {
  return (
    <DashboardLayout>
      <ContactsPage industryLabel="Consultants" mockContacts={contacts} />
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CalendarPage } from "../shared/CalendarPage";
import { addDays } from "date-fns";

const today = new Date();

const events = [
  { id: "1", title: "Strategy Review - Peters & Co", date: today, time: "10:00 AM - 12:00 PM", type: "meeting" as const, contact: "Alexandra Peters", location: "Zoom" },
  { id: "2", title: "Discovery Call - Hayes Ventures", date: today, time: "3:00 PM - 3:30 PM", type: "call" as const, contact: "Benjamin Hayes" },
  { id: "3", title: "Coaching Session - Charlotte Moore", date: addDays(today, 1), time: "2:00 PM - 3:00 PM", type: "meeting" as const, contact: "Charlotte Moore", location: "Office" },
  { id: "4", title: "Proposal deadline - Wright Tech", date: addDays(today, 3), time: "5:00 PM", type: "task" as const, contact: "Eleanor Wright" },
  { id: "5", title: "Quarterly planning", date: addDays(today, 5), time: "9:00 AM - 11:00 AM", type: "reminder" as const },
];

export default function UnifiedCalendarPage() {
  return (
    <DashboardLayout>
      <CalendarPage mockEvents={events} />
    </DashboardLayout>
  );
}

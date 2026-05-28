import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  MessageSquare,
  FileText,
  Users,
  TrendingUp,
  Video,
  LucideIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActiveClients, fetchNewClientsThisMonth } from "../../api/analytics";
import { useAuth } from "@/context/AuthContext";

interface ActionItem {
  icon: LucideIcon;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  time: string;
  route: string;
}

interface StatItem {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  route: string;
}

interface QuickAction {
  icon: LucideIcon;
  label: string;
  route: string;
}

const dashboardRoutes = {
  home: "/dashboard",
  contacts: "/dashboard/contacts",
  messages: "/dashboard/messages",
  calendar: "/dashboard/calendar",
  settings: "/dashboard/settings",
} as const;

const actions: ActionItem[] = [
  { icon: Mail, title: "Proposal response from Acme Corp", description: "They want to proceed - requesting contract for executive coaching", priority: "high", time: "30 minutes ago", route: dashboardRoutes.messages },
  { icon: Clock, title: "Check-in with Lisa Park", description: "Monthly strategy session - last touchpoint was 3 weeks ago", priority: "high", time: "Due today", route: dashboardRoutes.contacts },
  { icon: Video, title: "Prepare for tomorrow's session", description: "Robert Taylor - review notes from last coaching call", priority: "medium", time: "Tomorrow 10am", route: dashboardRoutes.calendar },
  { icon: MessageSquare, title: "LinkedIn message from prospect", description: "CEO of StartupXYZ interested in leadership coaching", priority: "medium", time: "2 hours ago", route: dashboardRoutes.messages },
  { icon: FileText, title: "Send recap to Maria Gonzalez", description: "Workshop follow-up with action items and resources", priority: "low", time: "This week", route: dashboardRoutes.contacts },
];

const defaultStats: StatItem[] = [
  { icon: Users, title: "Active Leads", value: "-", change: "-", trend: "up", route: dashboardRoutes.contacts },
  { icon: FileText, title: "Pending Proposals", value: 8, change: "+3", trend: "up", route: dashboardRoutes.messages },
  { icon: Video, title: "Sessions This Week", value: 12, change: "+4", trend: "up", route: dashboardRoutes.calendar },
  { icon: TrendingUp, title: "Close Rate", value: "72%", change: "+5%", trend: "up", route: dashboardRoutes.home },
];

const quickActions: QuickAction[] = [
  { icon: Users, label: "Add Client", route: dashboardRoutes.contacts },
  { icon: Video, label: "Schedule Session", route: dashboardRoutes.calendar },
  { icon: FileText, label: "Create Proposal", route: dashboardRoutes.messages },
];

export default function IndustryDashboard() {
  const [dashboardStats, setDashboardStats] = useState<StatItem[]>(defaultStats);
  const { orgId, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !orgId) return;

    const loadActiveClients = async () => {
      try {
        const newClients = await fetchNewClientsThisMonth(orgId);
        const activeClients = await fetchActiveClients(orgId);
        setDashboardStats((prevStats) =>
          prevStats.map((stat) =>
            stat.title === "Active Leads" ? { ...stat, value: activeClients, change: "+" + newClients } : stat
          )
        );
      } catch (error) {
        console.error("Error fetching active clients:", error);
      }
    };

    void loadActiveClients();
  }, [orgId, isLoading]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Good morning!</h1>
          <p className="text-muted-foreground">
            You have{" "}
            <span className="text-primary font-medium">{actions.length} actions</span> that need your
            attention today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat, index) => {
            const { route, ...statProps } = stat;

            return (
              <motion.button
                key={stat.title}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-left rounded-xl"
                onClick={() => navigate(route)}
              >
                <StatCard {...statProps} />
              </motion.button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Action Inbox</h2>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => navigate(dashboardRoutes.messages)}
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {actions.map((action, index) => {
              const { route, ...actionProps } = action;

              return (
                <motion.button
                  key={`${action.title}-${index}`}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="block w-full text-left rounded-xl"
                  onClick={() => navigate(route)}
                >
                  <ActionCard {...actionProps} />
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((qa) => (
            <motion.button
              key={qa.label}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 rounded-xl bg-primary/10 border border-primary/20 text-center hover:bg-primary/20 transition-colors"
              onClick={() => navigate(qa.route)}
            >
              <qa.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium">{qa.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

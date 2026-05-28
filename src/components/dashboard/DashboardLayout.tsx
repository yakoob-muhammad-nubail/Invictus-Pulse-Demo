import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

interface DashboardLayoutProps {
  children: React.ReactNode;
  industry?: string;
  industryTitle?: string;
}

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Contacts", url: "/dashboard/contacts", icon: Users },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

function DashboardSidebar() {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const supabaseUser = session?.user;
  const displayName =
    (supabaseUser?.user_metadata as { name?: string } | null)?.name ||
    supabaseUser?.email ||
    "";
  const email = supabaseUser?.email || "";
  const initial = (displayName || email || "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-border">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">IP</span>
          </div>
          <span className="font-display font-bold">Invictus Pulse</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Consultants</p>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-medium">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </Sidebar>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { session } = UserAuth();

  const supabaseUser = session?.user;
  const displayName =
    (supabaseUser?.user_metadata as { name?: string } | null)?.name ||
    supabaseUser?.email ||
    "";
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts, messages..."
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm font-medium">{initial}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

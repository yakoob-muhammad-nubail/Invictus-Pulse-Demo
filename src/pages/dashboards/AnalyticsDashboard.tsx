import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Activity,
  Building,
  ContactRound,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Clock,
  Server,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useTheme } from "@/context/ThemeContext";

// Mock data
const userGrowthData = [
  { date: "Jan", users: 120, newUsers: 45 },
  { date: "Feb", users: 190, newUsers: 70 },
  { date: "Mar", users: 280, newUsers: 90 },
  { date: "Apr", users: 390, newUsers: 110 },
  { date: "May", users: 520, newUsers: 130 },
  { date: "Jun", users: 680, newUsers: 160 },
  { date: "Jul", users: 850, newUsers: 170 },
  { date: "Aug", users: 1020, newUsers: 170 },
  { date: "Sep", users: 1200, newUsers: 180 },
  { date: "Oct", users: 1420, newUsers: 220 },
  { date: "Nov", users: 1650, newUsers: 230 },
  { date: "Dec", users: 1890, newUsers: 240 },
];

const dauData = [
  { date: "Mon", active: 342 },
  { date: "Tue", active: 398 },
  { date: "Wed", active: 456 },
  { date: "Thu", active: 389 },
  { date: "Fri", active: 412 },
  { date: "Sat", active: 267 },
  { date: "Sun", active: 234 },
];

const featureUsageData = [
  { feature: "Contacts", usage: 4520 },
  { feature: "Messages", usage: 3890 },
  { feature: "Calendar", usage: 2340 },
  { feature: "Dashboard", usage: 5670 },
  { feature: "Settings", usage: 890 },
  { feature: "Reports", usage: 1560 },
];

const planDistribution = [
  { name: "Free", value: 45, color: "hsl(var(--muted-foreground))" },
  { name: "Starter", value: 25, color: "hsl(var(--primary))" },
  { name: "Professional", value: 20, color: "hsl(var(--accent))" },
  { name: "Enterprise", value: 10, color: "hsl(190 95% 70%)" },
];

const recentActivity = [
  { user: "john@acme.co", feature: "Contacts", action: "Created contact", time: "2 min ago" },
  { user: "sarah@buildco.com", feature: "Messages", action: "Sent message", time: "5 min ago" },
  { user: "mike@realty.io", feature: "Calendar", action: "Scheduled event", time: "12 min ago" },
  { user: "lisa@clinic.med", feature: "Dashboard", action: "Viewed analytics", time: "18 min ago" },
  { user: "tom@consult.pro", feature: "Settings", action: "Updated profile", time: "25 min ago" },
  { user: "amy@buildco.com", feature: "Contacts", action: "Imported contacts", time: "32 min ago" },
  { user: "dave@realty.io", feature: "Messages", action: "Replied to lead", time: "45 min ago" },
  { user: "nina@clinic.med", feature: "Calendar", action: "Created reminder", time: "1 hr ago" },
];

const topUsers = [
  { user: "sarah@buildco.com", actions: 342, industry: "Contractors" },
  { user: "mike@realty.io", actions: 289, industry: "Real Estate" },
  { user: "lisa@clinic.med", actions: 256, industry: "Clinics" },
  { user: "tom@consult.pro", actions: 234, industry: "Consultants" },
  { user: "john@acme.co", actions: 198, industry: "Contractors" },
];

const orgData = [
  { name: "BuildCo Industries", size: 45 },
  { name: "Realty Group Pro", size: 32 },
  { name: "HealthFirst Clinics", size: 28 },
  { name: "Apex Consulting", size: 22 },
  { name: "Metro Contractors", size: 18 },
];

const retentionData = [
  { cohort: "Week 1", retention: 100 },
  { cohort: "Week 2", retention: 78 },
  { cohort: "Week 3", retention: 65 },
  { cohort: "Week 4", retention: 58 },
  { cohort: "Week 5", retention: 52 },
  { cohort: "Week 6", retention: 48 },
  { cohort: "Week 7", retention: 45 },
  { cohort: "Week 8", retention: 42 },
];

const hourlyActivity = [
  { hour: "6am", sessions: 23 }, { hour: "8am", sessions: 89 },
  { hour: "10am", sessions: 156 }, { hour: "12pm", sessions: 134 },
  { hour: "2pm", sessions: 178 }, { hour: "4pm", sessions: 145 },
  { hour: "6pm", sessions: 98 }, { hour: "8pm", sessions: 67 },
  { hour: "10pm", sessions: 34 },
];

function KPICard({ label, value, change, changeType, icon: Icon }: {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <Badge
          variant="secondary"
          className={changeType === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-red-400 bg-red-400/10"}
        >
          {changeType === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
        </Badge>
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [dateRange, setDateRange] = useState("30d");
  const [orgFilter, setOrgFilter] = useState("all");

  const chartTextColor = "hsl(var(--muted-foreground))";
  const gridColor = "hsl(var(--border))";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">IP</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">Admin Analytics</h1>
            <p className="text-xs text-muted-foreground">Invictus Pulse</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="buildco">BuildCo Industries</SelectItem>
                <SelectItem value="realty">Realty Group Pro</SelectItem>
                <SelectItem value="health">HealthFirst Clinics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard label="Total Users" value="1,890" change="+14.2%" changeType="up" icon={Users} />
          <KPICard label="Active (7d)" value="456" change="+8.1%" changeType="up" icon={Activity} />
          <KPICard label="New This Month" value="240" change="+22.4%" changeType="up" icon={UserPlus} />
          <KPICard label="Total Contacts" value="12,340" change="+5.3%" changeType="up" icon={ContactRound} />
          <KPICard label="Organizations" value="87" change="-2.1%" changeType="down" icon={Building} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">User Growth Over Time</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#colorUsers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* DAU */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">Daily Active Users</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="active" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feature Usage */}
          <Card className="p-6 border-border lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-accent" />
              <h3 className="font-display font-semibold">Feature Usage Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis dataKey="feature" type="category" tick={{ fill: chartTextColor, fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="usage" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Plan Distribution */}
          <Card className="p-6 border-border">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold">Plan Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-muted-foreground">{plan.name}</span>
                  <span className="font-medium ml-auto">{plan.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="p-6 border-border">
            <h3 className="font-display font-semibold mb-4">Recent User Activity</h3>
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Feature</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{row.user}</TableCell>
                      <TableCell><Badge variant="secondary">{row.feature}</Badge></TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Top Users + Org Size */}
          <div className="space-y-6">
            <Card className="p-6 border-border">
              <h3 className="font-display font-semibold mb-4">Top Active Users</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUsers.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{row.user}</TableCell>
                      <TableCell><Badge variant="outline">{row.industry}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{row.actions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-6 border-border">
              <h3 className="font-display font-semibold mb-4">Organization Size Overview</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="text-right font-medium">{row.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>

        {/* Retention & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retention Cohort */}
          <Card className="p-6 border-border">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold">Retention Curve</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="cohort" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="retention" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">78%</p>
                <p className="text-xs text-muted-foreground">7-day Retention</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">42%</p>
                <p className="text-xs text-muted-foreground">30-day Retention</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">3.2%</p>
                <p className="text-xs text-muted-foreground">Monthly Churn</p>
              </div>
            </div>
          </Card>

          {/* Peak Hours + System Health */}
          <div className="space-y-6">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-display font-semibold">Peak Activity Hours</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={hourlyActivity}>
                  <XAxis dataKey="hour" tick={{ fill: chartTextColor, fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-5 w-5 text-emerald-500" />
                <h3 className="font-display font-semibold">System Health</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "API Uptime", value: "99.98%", icon: Zap, status: "good" },
                  { label: "Avg Response Time", value: "142ms", icon: Clock, status: "good" },
                  { label: "Error Rate", value: "0.12%", icon: Activity, status: "good" },
                  { label: "Active Connections", value: "1,247", icon: RefreshCw, status: "good" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-sm">{item.value}</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Advanced Insights */}
        <Card className="p-6 border-border">
          <h3 className="font-display font-semibold mb-4">Advanced Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Avg Sessions/User", value: "4.7", change: "+12%" },
              { label: "Free→Paid Conversion", value: "8.2%", change: "+1.4%" },
              { label: "Avg Session Duration", value: "6m 42s", change: "+18%" },
              { label: "Bounce Rate", value: "23.4%", change: "-5.2%" },
              { label: "NPS Score", value: "72", change: "+3" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg border border-border text-center">
                <p className="text-2xl font-bold font-display">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                <p className="text-xs text-emerald-500 mt-1">{item.change}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

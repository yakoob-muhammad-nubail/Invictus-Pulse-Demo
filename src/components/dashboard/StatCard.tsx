import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ icon: Icon, title, value, change, trend = "neutral" }: StatCardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-display font-bold">{value}</p>
    </motion.div>
  );
}

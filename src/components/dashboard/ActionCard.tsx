import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  time?: string;
  onClick?: () => void;
}

export function ActionCard({ icon: Icon, title, description, priority = "medium", time, onClick }: ActionCardProps) {
  const priorityColors = {
    high: "border-l-destructive",
    medium: "border-l-primary",
    low: "border-l-muted-foreground",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl bg-card border border-border border-l-4 ${priorityColors[priority]} hover:bg-muted/50 transition-colors`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium mb-1 truncate">{title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          {time && (
            <p className="text-xs text-muted-foreground mt-2">{time}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

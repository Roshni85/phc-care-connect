import { cn } from "@/lib/utils";
import { LucideIcon, ChevronRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  badge?: string | number;
  badgeVariant?: "default" | "warning" | "success" | "destructive";
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  badge,
  badgeVariant = "default",
  className,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl bg-card p-4 text-left shadow-card transition-all duration-200",
        "hover:shadow-elevated hover:bg-accent/50 active:scale-[0.98]",
        className
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          {badge !== undefined && (
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                badgeVariant === "default" && "bg-muted text-muted-foreground",
                badgeVariant === "warning" && "bg-warning/15 text-warning-foreground",
                badgeVariant === "success" && "bg-success/15 text-success",
                badgeVariant === "destructive" && "bg-destructive/15 text-destructive"
              )}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </button>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        new: "bg-info/15 text-info",
        in_review: "bg-warning/15 text-warning-foreground",
        verified: "bg-success/15 text-success",
        sent_back: "bg-destructive/15 text-destructive",
        active: "bg-success/15 text-success",
        inactive: "bg-muted text-muted-foreground",
        low_stock: "bg-destructive/15 text-destructive",
        expiring: "bg-warning/15 text-warning-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

function StatusBadge({ className, variant, size, dot = true, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "new" && "bg-info",
            variant === "in_review" && "bg-warning",
            variant === "verified" && "bg-success",
            variant === "sent_back" && "bg-destructive",
            variant === "active" && "bg-success",
            variant === "inactive" && "bg-muted-foreground",
            variant === "low_stock" && "bg-destructive",
            variant === "expiring" && "bg-warning",
            (!variant || variant === "default") && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { StatusBadge, statusBadgeVariants };

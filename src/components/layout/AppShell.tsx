import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export function AppShell({ children, className, hasBottomNav = true }: AppShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        hasBottomNav && "pb-20",
        className
      )}
    >
      {children}
    </div>
  );
}

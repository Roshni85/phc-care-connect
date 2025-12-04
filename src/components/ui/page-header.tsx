import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  backPath,
  action,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border", className)}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}

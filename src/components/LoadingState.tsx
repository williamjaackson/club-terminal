import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  fullPage?: boolean;
  text?: string;
  className?: string;
}

export function LoadingState({
  fullPage = false,
  text = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullPage ? "min-h-screen" : "py-12",
        className
      )}
    >
      <LoadingSpinner size="lg" className="mb-4" />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}

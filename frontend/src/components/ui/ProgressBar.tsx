import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
  variant?: "default" | "processing" | "completed" | "flagged";
}

const variantClasses = {
  default: "bg-primary",
  processing: "bg-status-processing",
  completed: "bg-status-completed",
  flagged: "bg-status-flagged",
};

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  animated = false,
  variant = "default",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant],
            animated && percentage < 100 && "animate-progress-stripe bg-[length:1rem_1rem] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 block text-xs text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

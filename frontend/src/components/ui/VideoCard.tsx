import { Play, Clock, Trash2, Globe, Lock, Shield, Users } from "lucide-react";
import { Badge } from "./badge";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface VideoCardProps {
  id?: string;
  title: string;
  thumbnail?: string;
  status: "Uploaded" | "Processing" | "Completed" | "Flagged";
  sensitivity?: "Safe" | "Flagged";
  visibility?: "public" | "private" | "restricted" | "admin-only";
  progress?: number;
  timestamp?: string;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  showProgress?: boolean;
  className?: string;
  duration?: string;
  views?: string | number;
  uploadedAt?: string;
  uploader?: {
    name: string;
    avatar?: string;
  };
}

const statusVariantMap: Record<string, "uploaded" | "processing" | "completed" | "flagged"> = {
  Uploaded: "uploaded",
  Processing: "processing",
  Completed: "completed",
  Flagged: "flagged",
  // Map backend statuses
  pending: "uploaded",
  processing: "processing",
  safe: "completed",
  flagged: "flagged"
};

const VisibilityIcon = ({ visibility }: { visibility?: string }) => {
  switch (visibility) {
    case 'private': return <Lock className="h-3 w-3" />;
    case 'restricted': return <Users className="h-3 w-3" />;
    case 'admin-only': return <Shield className="h-3 w-3" />;
    default: return <Globe className="h-3 w-3" />; // public
  }
};

export function VideoCard({
  title,
  thumbnail,
  status,
  sensitivity,
  visibility = 'public',
  progress = 0,
  timestamp,
  onClick,
  onDelete,
  showProgress = false,
  className,
}: VideoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
              <Play className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/20 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Top Actions Overlay */}
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Delete Button (Only visible if onDelete provided) */}
          {onDelete && (
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
          <Badge variant={statusVariantMap[status]}>{status}</Badge>
        </div>

        {/* Visibility Badge (Visible on hover or always?) Let's put top left */}
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm gap-1 border-0">
            <VisibilityIcon visibility={visibility} />
            <span className="capitalize text-[10px]">{visibility === 'admin-only' ? 'Admin' : visibility}</span>
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-card-foreground line-clamp-2 text-sm">
            {title}
          </h3>
          {sensitivity && (
            <Badge variant={sensitivity === "Safe" ? "safe" : "flagged"} size="sm">
              {sensitivity}
            </Badge>
          )}
        </div>

        {showProgress && status === "Processing" && (
          <div className="mt-3">
            <ProgressBar value={progress} variant="processing" animated />
          </div>
        )}

        {timestamp && (
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>{timestamp}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

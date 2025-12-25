import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoCard } from "@/components/ui/VideoCard";
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

export default function ProcessingStatus() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/videos', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      console.log("Fetched videos:", data);
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on('videoStatusUpdate', (updatedVideo: any) => {
      console.log("Socket update:", updatedVideo);
      setVideos(prevVideos =>
        prevVideos.map(v =>
          v._id === updatedVideo.videoId
            ? { ...v, sensitivityStatus: updatedVideo.status, processingProgress: updatedVideo.progress }
            : v
        )
      );
    });

    return () => {
      socket.off('videoStatusUpdate');
    };
  }, [socket]);

  const handleRefresh = () => {
    fetchVideos();
  };

  const activeProcessing = videos.filter(
    (v) => v.sensitivityStatus === 'processing' || v.sensitivityStatus === 'pending'
  ).length;

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Processing Status
            </h1>
            <p className="mt-1 text-muted-foreground">
              Monitor your video processing queue
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Processing"
            value={activeProcessing}
            icon={Activity}
            color="text-status-processing"
          />
          <StatCard
            label="Completed"
            value={videos.filter((v) => v.sensitivityStatus === "safe" || v.sensitivityStatus === "flagged").length}
            color="text-status-completed"
          />
          <StatCard
            label="Flagged"
            value={videos.filter((v) => v.sensitivityStatus === "flagged").length}
            color="text-status-flagged"
          />
          <StatCard
            label="Total Videos"
            value={videos.length}
            color="text-primary"
          />
        </div>

        {/* Video List */}
        <div className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Recent Uploads
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.length === 0 && !isLoading ? (
              <p className="text-muted-foreground p-4">No videos found. Upload one to get started!</p>
            ) : (
              videos.map((video, index) => (
                <div
                  key={video._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VideoCard
                    title={video.title}
                    thumbnail={video.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"}
                    duration={video.duration || "00:00"}
                    views={video.views || "0 views"}
                    uploadedAt={new Date(video.createdAt).toLocaleDateString()}
                    uploader={{
                      name: video.uploader?.name || "Unknown",
                      avatar: "https://github.com/shadcn.png"
                    }}
                    status={video.sensitivityStatus === 'processing' ? 'Processing' :
                      video.sensitivityStatus === 'flagged' ? 'Flagged' : 'Completed'}
                    progress={video.processingProgress}
                    showProgress={video.sensitivityStatus === 'processing'}
                    onClick={() => console.log("View video:", video._id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ElementType;
  color?: string;
}

function StatCard({ label, value, icon: Icon, color = "text-foreground" }: StatCardProps) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-card border border-border">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className={`h-5 w-5 ${color}`} />}
      </div>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

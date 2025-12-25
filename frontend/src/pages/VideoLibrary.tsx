import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoCard } from "@/components/ui/VideoCard";
import { Grid, List, Filter, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function VideoLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/videos', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchVideos();
    }
  }, [user]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredVideos = videos.filter((video) => {
    // Search Filter
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch =
      video.title.toLowerCase().includes(searchLower) ||
      (video.description && video.description.toLowerCase().includes(searchLower));

    // Status Filter
    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    const sens = video.sensitivityStatus === 'safe' ? 'safe' : (video.sensitivityStatus === 'flagged' ? 'flagged' : '');
    return sens === statusFilter;
  });

  const handleVideoClick = (videoId: string) => {
    navigate(`/player/${videoId}`);
  };

  const handleDelete = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation(); // Prevent navigation to player
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;

    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      // Remove from local state
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete video");
    }
  };

  const mapStatus = (status: string): any => {
    switch (status) {
      case 'pending': return 'Uploaded';
      case 'processing': return 'Processing';
      case 'safe': return 'Completed';
      case 'flagged': return 'Flagged';
      default: return 'Uploaded';
    }
  }

  const mapSensitivity = (status: string): any => {
    if (status === 'safe') return 'Safe';
    if (status === 'flagged') return 'Flagged';
    return undefined;
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Video Library</h1>
            <p className="mt-1 text-muted-foreground">
              {filteredVideos.length} videos in your library
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2 w-full sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              Status: {statusFilter === "all" ? "All" : statusFilter}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 z-10 mt-2 w-40 rounded-lg bg-card shadow-lg border border-border overflow-hidden">
                {["all", "safe", "flagged"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors capitalize",
                      statusFilter === status && "bg-muted font-medium"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Sections */}
        <div className="space-y-12">

          {/* My Videos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">My Videos</h2>
            {filteredVideos.filter(v => user && v.uploader && v.uploader._id === user._id).length > 0 ? (
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid"
                    ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredVideos.filter(v => user && v.uploader && v.uploader._id === user._id).map((video, index) => (
                  <div
                    key={video._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <VideoCard
                      id={video._id}
                      title={video.title}
                      status={mapStatus(video.sensitivityStatus)}
                      sensitivity={mapSensitivity(video.sensitivityStatus)}
                      visibility={video.visibility}
                      timestamp={new Date(video.createdAt).toLocaleDateString()}
                      duration={video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "00:00"}
                      views={video.views}
                      uploadedAt={new Date(video.createdAt).toLocaleDateString()}
                      uploader={{ name: video.uploader?.name || "Unknown" }}
                      onClick={() => handleVideoClick(video._id)}
                      onDelete={(e) => handleDelete(e, video._id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">You haven't uploaded any videos yet.</p>
            )}
          </div>

          {/* Shared with Me */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <h2 className="text-xl font-semibold text-foreground">Shared & Public</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">From Organization</span>
            </div>

            {filteredVideos.filter(v => !user || !v.uploader || v.uploader._id !== user._id).length > 0 ? (
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid"
                    ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredVideos.filter(v => !user || !v.uploader || v.uploader._id !== user._id).map((video, index) => (
                  <div
                    key={video._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <VideoCard
                      id={video._id}
                      title={video.title}
                      status={mapStatus(video.sensitivityStatus)}
                      sensitivity={mapSensitivity(video.sensitivityStatus)}
                      visibility={video.visibility}
                      timestamp={new Date(video.createdAt).toLocaleDateString()}
                      duration={video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "00:00"}
                      views={video.views}
                      uploadedAt={new Date(video.createdAt).toLocaleDateString()}
                      uploader={{ name: video.uploader?.name || "Unknown" }}
                      onClick={() => handleVideoClick(video._id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No shared videos found.</p>
            )}
          </div>

        </div>

        {filteredVideos.length === 0 && !isLoading && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No videos found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

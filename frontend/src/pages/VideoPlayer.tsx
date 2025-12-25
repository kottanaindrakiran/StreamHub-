import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Play,
  Pause,
  Volume2,
  Maximize,
  ArrowLeft,
  Download,
  Share2,
  Clock,
  Eye,
  Calendar,
  Settings,
  X,
  Lock,
  Globe,
  Users,
  Shield
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editVisibility, setEditVisibility] = useState("");
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedAllowedUsers, setSelectedAllowedUsers] = useState<string[]>([]);

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setVideo(data);
      setEditVisibility(data.visibility);
      // Set initial allowed users if they exist
      if (data.allowedUsers && Array.isArray(data.allowedUsers)) {
        // If populated objects, map to IDs. If strings, use as is.
        const ids = data.allowedUsers.map((u: any) => u._id || u);
        setSelectedAllowedUsers(ids);
      }
    } catch (error: any) {
      console.error("Error fetching video:", error);
      toast.error(error.response?.data?.message || error.message || "Error loading video");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAvailableUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchVideo();
    }
  }, [user, id]);

  useEffect(() => {
    if (isEditing && user && (user.role === 'admin' || user.role === 'editor')) {
      fetchUsers();
    }
  }, [isEditing, user]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  const handleSaveVisibility = async () => {
    try {
      await axios.put(`http://localhost:5000/api/videos/${id}`, {
        visibility: editVisibility,
        allowedUsers: editVisibility === 'restricted' ? JSON.stringify(selectedAllowedUsers) : undefined
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success("Visibility updated!");
      setIsEditing(false);
      fetchVideo(); // Refresh
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedAllowedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (!video) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-full">Loading...</div>
    </DashboardLayout>
  );

  const canEdit = user && video && (
    user.role === 'admin' ||
    (video.uploader && (video.uploader._id === user._id || video.uploader === user._id))
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-6xl mx-auto relative">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>

        {/* Video Player Container */}
        <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
          <div className="relative aspect-video bg-black flex justify-center items-center">
            <video
              key={video._id + video.updatedAt} // Force reload on update
              ref={videoRef}
              src={`http://localhost:5000/api/videos/${id}/stream?token=${user?.token}`}
              className="w-full h-full"
              controls
              crossOrigin="anonymous"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-6 rounded-2xl bg-card p-6 shadow-card border border-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {video.title}
                </h1>

                {/* Visibility Badge */}
                <Badge variant="outline" className="gap-1 capitalize">
                  {video.visibility === 'public' && <Globe className="h-3 w-3" />}
                  {video.visibility === 'private' && <Lock className="h-3 w-3" />}
                  {video.visibility === 'restricted' && <Users className="h-3 w-3" />}
                  {video.visibility === 'admin-only' && <Shield className="h-3 w-3" />}
                  {video.visibility}
                </Badge>

                <Badge variant={video.status === "Completed" || video.sensitivityStatus === 'safe' ? "completed" : "flagged"}>
                  {video.sensitivityStatus === 'safe' ? 'Completed' : video.sensitivityStatus}
                </Badge>
                <Badge variant={video.sensitivityStatus === "safe" ? "safe" : "flagged"}>
                  {video.sensitivityStatus === 'safe' ? 'Safe' : 'Flagged'}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {video.description}
              </p>
            </div>

            <div className="flex gap-2">
              {canEdit && (
                <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4" />
                  Visibility
                </Button>
              )}

              <Button variant="outline" className="gap-2" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => {
                window.open(`http://localhost:5000/api/videos/${id}/download?token=${user?.token}`, '_blank');
              }}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-border">
            <MetadataItem icon={Clock} label="Duration" value={video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "00:00"} />
            <MetadataItem icon={Eye} label="Views" value={video.views?.toLocaleString() || "0"} />
            <MetadataItem icon={Calendar} label="Uploaded" value={new Date(video.createdAt).toLocaleDateString()} />
            <MetadataItem label="Size" value={(video.size / (1024 * 1024)).toFixed(2) + " MB"} />
            {video.availableResolutions && (
              <MetadataItem icon={Maximize} label="Quality" value={video.availableResolutions.join(", ")} />
            )}
          </div>
        </div>

        {/* Edit Logic Modal (Simple Overlay) */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border border-border animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit Visibility</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Who can see this video?</label>
                  <div className="grid gap-2">
                    {[
                      { value: 'public', label: 'Tenant-wide (Public)', icon: Globe, desc: 'All users in organization' },
                      { value: 'private', label: 'Private', icon: Lock, desc: 'Only you' },
                      { value: 'restricted', label: 'Restricted', icon: Users, desc: 'Selected users' },
                      { value: 'admin-only', label: 'Admins Only', icon: Shield, desc: 'Only admins' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setEditVisibility(option.value)}
                        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${editVisibility === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted'
                          }`}
                      >
                        <div className={`mt-0.5 rounded-md p-1 ${editVisibility === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <option.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Restricted User Selection */}
                {editVisibility === 'restricted' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                    <label className="text-sm font-medium">Select Users</label>
                    <div className="border rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                      {availableUsers.map(u => (
                        <div key={u._id} className="flex items-center space-x-2 p-1 hover:bg-muted rounded">
                          <Checkbox
                            id={`user-${u._id}`}
                            checked={selectedAllowedUsers.includes(u._id)}
                            onCheckedChange={() => toggleUserSelection(u._id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`user-${u._id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {u.name}
                            </label>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      ))}
                      {availableUsers.length === 0 && <p className="text-sm text-muted">No other users found.</p>}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveVisibility}>Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

interface MetadataItemProps {
  icon?: React.ElementType;
  label: string;
  value: string;
}

function MetadataItem({ icon: Icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

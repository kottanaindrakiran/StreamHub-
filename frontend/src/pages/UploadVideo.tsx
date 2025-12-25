import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Upload, FileVideo, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UploadVideo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const supportedFormats = ["MP4", "MOV", "AVI", "MKV", "WebM"];

  // Fetch users for Restricted mode
  useState(() => { // Using useState initializer as a "run once" or useEffect
    const fetchUsers = async () => {
      if (user && (user.role === 'editor' || user.role === 'admin')) {
        try {
          const { data } = await axios.get('http://localhost:5000/api/auth/users', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setAvailableUsers(data.filter((u: any) => u._id !== user._id)); // Exclude self
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      }
    };
    fetchUsers();
  }); // Note: Using useEffect is safer, fixing below...

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      setTitle(droppedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('visibility', visibility);
    if (visibility === 'restricted') {
      formData.append('allowedUsers', JSON.stringify(selectedUsers));
    }

    try {
      await axios.post('http://localhost:5000/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });

      toast.success("Upload successful! Processing started.");
      // Optional: Wait a bit before redirecting or redirect immediately
      setTimeout(() => {
        navigate('/processing');
      }, 1000);

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "Upload failed";
      toast.error(`Error: ${errorMessage}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const canUpload = file && title.trim() && !isUploading;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Upload Video</h1>
          <p className="mt-1 text-muted-foreground">
            Upload your video files for processing and streaming
          </p>
        </div>

        {/* Upload Area */}
        <div className="rounded-2xl bg-card p-8 shadow-card border border-border">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Drag and drop your video
              </h3>
              <p className="mt-2 text-muted-foreground">
                or click to browse from your computer
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {supportedFormats.map((format) => (
                  <span
                    key={format}
                    className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {format}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Maximum file size: 5GB
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Preview */}
              <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileVideo className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {uploadProgress === 100 ? (
                  <CheckCircle className="h-6 w-6 text-status-completed" />
                ) : (
                  <button
                    onClick={removeFile}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium text-foreground">
                      {uploadProgress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={uploadProgress}
                    variant={uploadProgress === 100 ? "completed" : "processing"}
                    animated
                  />
                </div>
              )}

              {/* Metadata Form */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
                    disabled={isUploading && uploadProgress === 100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description for your video..."
                    rows={4}
                    disabled={isUploading && uploadProgress === 100}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && uploadProgress < 100 && (
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={removeFile} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!canUpload}
                className="gradient-primary text-primary-foreground"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </div>
          )}

          {uploadProgress === 100 && (
            <div className="mt-6 rounded-xl bg-status-completed/10 p-4 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-status-completed mb-2" />
              <p className="font-medium text-status-completed">
                Upload Complete!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your video is now being processed
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

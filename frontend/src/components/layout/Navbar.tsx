import { useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns"; // You might need to install this or use simple formatting

interface NavbarProps {
  userRole?: string;
  userName?: string;
  userAvatar?: string;
}

const roleVariantMap: Record<string, "admin" | "editor" | "viewer"> = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer"
};

export function Navbar({
  userRole,
  userName,
  userAvatar
}: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const finalUserName = userName || user?.name || "Guest";
  const finalUserRole = userRole || user?.role || "viewer";

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("newVideoUploaded", (data: { uploader: string; title: string, id: string }) => {
      setNotifications(prev => [
        { ...data, timestamp: new Date(), read: false },
        ...prev
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationClick = (n: any) => {
    navigate(`/video/${n.id}`);
    setShowDropdown(false);
  };

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-flagged text-[10px] text-white font-bold ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg animate-in fade-in zoom-in-95 origin-top-right overflow-hidden">
              <div className="p-3 border-b border-border">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Bell className="h-8 w-8 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((n, i) => (
                      <button
                        key={i}
                        onClick={() => handleNotificationClick(n)}
                        className="flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                          <Video className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{n.title}</p>
                          <p className="text-xs text-muted-foreground">Uploaded by {n.uploader}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Just now</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{finalUserName}</p>
            <Badge variant={roleVariantMap[finalUserRole] as any} size="sm">
              {finalUserRole}
            </Badge>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full bg-muted ring-2 ring-border">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={finalUserName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-medium">
                {finalUserName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

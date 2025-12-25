import { NavLink, useLocation } from "react-router-dom";
import { Upload, FolderOpen, Activity, Settings, Video, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Upload Video", href: "/upload", icon: Upload },
  { name: "Video Library", href: "/library", icon: FolderOpen },
  { name: "Processing Status", href: "/processing", icon: Activity },
  { name: "Admin Panel", href: "/admin", icon: Shield, roles: ['admin'] },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'viewer';

  const filteredNavigation = navigation.filter(item => {
    if (item.roles) {
      return item.roles.includes(userRole);
    }
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Video className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            StreamHub
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs text-sidebar-foreground/70">
              Logged in as
            </p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'Guest'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

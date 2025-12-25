import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Shield, UserCheck, UserX } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Assuming this path for AuthContext
import { toast } from "sonner"; // Assuming sonner for toasts

// Define User interface based on expected frontend structure
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  lastActive: string; // Or Date object if preferred
}

export default function AdminPanel() {
  const { user } = useAuth(); // Get user from auth context for token

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        // Map backend user to frontend user interface
        // Backend User: { _id, name, email, role, createdAt }
        // Frontend expects: { id, name, email, role, status }
        // We'll default status to 'active' since backend doesn't track it yet.
        const mappedUsers = data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'active', // Default to active
          lastActive: new Date(u.createdAt).toLocaleDateString() // Use createdAt as proxy for now
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user]);

  // Handlers
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole as "admin" | "editor" | "viewer" } : u
      ));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
    // Backend doesn't support status updates yet, so we just update UI for now or show toast
    // Future: Add /api/auth/users/:id/status
    toast.info("Status updates not yet supported by backend");
    /* 
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
    */
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">Loading users...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-1 text-muted-foreground">
            Manage users and assign roles
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-card p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-completed/10">
                <UserCheck className="h-5 w-5 text-status-completed" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-flagged/10">
                <Shield className="h-5 w-5 text-status-flagged" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === "admin").length}
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-card shadow-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.status === "active" ? "completed" : "secondary"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
                        className={user.status === "active"
                          ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                          : "text-status-completed hover:text-status-completed hover:bg-status-completed/10"
                        }
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="mr-1 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-1 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Palette, LogOut, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    uploadComplete: true,
    processingComplete: true,
    flaggedContent: true,
    weeklyDigest: false,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await axios.put('http://localhost:5000/api/auth/profile',
        { name, email },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      updateUser(data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <SettingsSection
            icon={User}
            title="Profile"
            description="Update your personal information"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Name</Label>
                <Input
                  id="firstName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                    setEmail(user?.email || "");
                  }}>
                    Cancel
                  </Button>
                  <Button
                    className="gradient-primary text-primary-foreground"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </SettingsSection>

          {/* Notifications Section */}
          <SettingsSection
            icon={Bell}
            title="Notifications"
            description="Choose what notifications you receive"
          >
            <div className="space-y-4">
              <NotificationToggle
                label="Upload Complete"
                description="Get notified when your video upload finishes"
                checked={notifications.uploadComplete}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, uploadComplete: checked }))
                }
              />
              <NotificationToggle
                label="Processing Complete"
                description="Get notified when video processing is done"
                checked={notifications.processingComplete}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, processingComplete: checked }))
                }
              />
              <NotificationToggle
                label="Flagged Content Alerts"
                description="Receive alerts when content is flagged"
                checked={notifications.flaggedContent}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, flaggedContent: checked }))
                }
              />
              <NotificationToggle
                label="Weekly Digest"
                description="Receive a weekly summary of your activity"
                checked={notifications.weeklyDigest}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, weeklyDigest: checked }))
                }
              />
            </div>
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection
            icon={Shield}
            title="Security"
            description="Manage your security settings"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline">Update Password</Button>
            </div>
          </SettingsSection>

          {/* Logout Section */}
          <div className="rounded-2xl bg-card p-6 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Sign Out</h2>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Preferences Section */}
          <SettingsSection
            icon={Palette}
            title="Preferences"
            description="Customize your experience"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Default Video Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred streaming quality
                  </p>
                </div>
                <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Autoplay Videos</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically play videos when opened
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ icon: Icon, title, description, children }: SettingsSectionProps) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-card border border-border">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function NotificationToggle({ label, description, checked, onChange }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

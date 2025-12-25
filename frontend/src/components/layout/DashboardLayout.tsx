import { ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { io } from "socket.io-client";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("newVideoUploaded", (data: { uploader: string; title: string }) => {
      toast.info(`New Video Uploaded!`, {
        description: `${data.title} by ${data.uploader}`,
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

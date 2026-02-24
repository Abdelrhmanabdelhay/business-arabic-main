"use client";
import { DashboardNavbar } from "@/components/PagesComponents/DashboardLayout/DashboardNavbar";
import { DashboardSidebar } from "@/components/PagesComponents/DashboardLayout/DashboardSidebar";

import { ReactNode, useState, useEffect } from "react";
interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          role="button"
          tabIndex={0}
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSidebarOpen(false);
            }
          }}
        />
      )}

      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
      />

      {/* Main content wrapper */}
      <div className={`transition-all duration-300 ${isSidebarOpen && !isMobile ? "lg:mr-[280px]" : "lg:mr-20"}`}>
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="pt-24 px-4 sm:px-6 pb-6 max-w-[2000px] mx-auto">{children}</main>
      </div>
    </div>
  );
}

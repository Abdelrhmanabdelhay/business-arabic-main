"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiGrid, FiBriefcase, FiMenu } from "react-icons/fi";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";

interface MenuItem {
  title: string;
  icon: any;
  path: string;
  submenu: { title: string; path: string }[];
  requiredRole?: "admin" | "user";
}

const menuItems: MenuItem[] = [
  {
    title: "المستخدمين",
    icon: FiUsers,
    path: "/dashboard/users",
    submenu: [],
    requiredRole: "admin",
  },
  {
    title: "دراسات الجدوي",
    icon: FiGrid,
    path: "/dashboard/projects",
    submenu: [
      { title: "قائمة دراسات الجدوي", path: "/dashboard/projects" },
      { title: "إضافة دراسة جدوي", path: "/dashboard/projects/new" },
    ],
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export function DashboardSidebar({ isSidebarOpen, toggleSidebar, isMobile }: SidebarProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { user } = useUserStore();

  const toggleSubmenu = (title: string) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  return (
    <motion.aside
      initial={false}
      animate={isSidebarOpen ? "open" : "closed"}
      variants={{
        open: {
          width: "280px",
          x: 0,
          transition: { duration: 0.3 },
        },
        closed: {
          width: isMobile ? "0px" : "80px",
          x: isMobile ? 280 : 0,
          transition: { duration: 0.3 },
        },
      }}
      className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200/80 shadow-lg shadow-gray-200/50 z-30 
            ${isMobile ? "w-[280px]" : ""}`}>
      <div className="flex flex-col h-full">
        <div className="h-16 px-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold text-primary-800">
                لوحة التحكم
              </motion.div>
            )}
          </AnimatePresence>
          <Button isIconOnly variant="light" onPress={toggleSidebar} className="text-primary-800 hover:bg-primary-50">
            <FiMenu size={24} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems
            .filter((item) => !item.requiredRole || item.requiredRole === user?.role)
            .map((item) => (
            <div key={item.title} className="mb-1">
              <button
                onClick={() => toggleSubmenu(item.title)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname.startsWith(item.path)
                    ? "text-primary-800 bg-primary-50 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <item.icon size={20} className="ml-3" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 text-right truncate">
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isSidebarOpen && item.submenu.length > 0 && (
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    animate={{ rotate: activeSubmenu === item.title ? 180 : 0 }}
                    className="text-current">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 7l-5 5-5-5"
                    />
                  </motion.svg>
                )}
              </button>

              <AnimatePresence>
                {isSidebarOpen && activeSubmenu === item.title && item.submenu.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={`block px-12 py-2.5 text-sm rounded-lg mr-2 my-1 transition-colors ${
                          pathname === subItem.path
                            ? "text-primary-800 font-semibold bg-primary-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}>
                        {subItem.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}

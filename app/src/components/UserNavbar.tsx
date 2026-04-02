"use client";

import { Navbar } from "@/components/navbar";
import React from "react";
import { Logout } from "@/lib/actions/auth";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useRouter } from "next/dist/client/components/navigation";

export const UserNavbar = () => {
  const userNavItems = [
    { href: "/userp", label: "الرئيسية" },
    { href: "/idea-club", label: " افكار مشاريع" },
    { href: "/feasibility-studiesuser", label: "دراسات الجدوى" },
    { href: "/user/consultation", label: "تطوير ونمو اعمال" },
  ];
const logout = useUserStore((state) => state.logout);
  const router = useRouter();

const handleLogout = async () => {
  await Logout();
  logout();
  router.push("/");
};
  const userDropdownItems = [
    { key: "profile", label: "الملف الشخصي", href: "/profile" },
    { key: "orders", label: "طلباتي", href: "/my-orders" },
    { key: "logout", label: "تسجيل الخروج", action: handleLogout },
  ];

  return (
    <Navbar
      navItems={userNavItems}
      dropdownItems={userDropdownItems}
    />
  );
};
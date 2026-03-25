"use client";

import { Navbar } from "@/components/navbar";

export const UserNavbar = () => {
  const userNavItems = [
    { href: "/profile", label: "حسابي" },
    { href: "/my-orders", label: "طلباتي" },
  ];

  const userDropdownItems = [
    { key: "profile", label: "الملف الشخصي", href: "/profile" },
    { key: "orders", label: "طلباتي", href: "/my-orders" },
    { key: "logout", label: "تسجيل الخروج" },
  ];

  return (
    <Navbar
      navItems={userNavItems}
      dropdownItems={userDropdownItems}
    />
  );
};
"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "./icons";
import { siteConfig } from "@/config/site";
import { User } from "@/types/user.type";
import { Logout } from "@/lib/actions/auth";
import { parseCookies } from "nookies";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { useUserStore } from "@/lib/stores/useUserStore";
import { UserNavbar } from "./UserNavbar";
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ href, children, className = "", onClick }: NavLinkProps) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (onClick) onClick();
        router.push(href);
      }}
      className={`text-[15px] text-[#1a1a1a] hover:text-[#3366FF] transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  );
};

interface NavbarProps {
  onSearch?: (value: string) => void;
  navItems?: { href: string; label: string }[];
  dropdownItems?: any[];
}

export const Navbar = ({ onSearch, navItems, dropdownItems }: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
const { user, isAuthenticated, hasHydrated } = useUserStore();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

const isFeasibilityPage = pathname === "/feasibility-studies";

const logout = useUserStore((state) => state.logout);

const handleLogout = async () => {
  await Logout();
  logout();
  router.push("/");
};

const handleNavigation = (path?: string) => {
  if (!path) return; 
  router.push(path);
};
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (pathname === "/feasibility-studies") {
      onSearch?.(value);
      // Update URL with search param
      const params = new URLSearchParams();
      if (value) {
        params.set('search', value);
      }
      router.push(`/feasibility-studies?${params.toString()}`);
    }
  };

  const userDropdownItems = [
    { key: "profile", label: "الملف الشخصي", href: "/profile" },
    { key: "orders", label: "الطلبات", href: "/my-orders" },
    { key: "logout", label: "تسجيل الخروج", action: handleLogout },
  ];
if (!hasHydrated) return null;


  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-white h-[72px] shadow-none"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Logo & Links */}
      <NavbarContent className="basis-1/2 sm:basis-2/3" justify="end">
        <NavbarBrand className="gap-3 max-w-fit">
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <Logo />
          </button>
        </NavbarBrand>
        <div className="hidden lg:flex gap-12 items-center mr-8">
          {(navItems || siteConfig.navItems).map((item) => (
            <NavbarItem key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* Right Side: User/Auth or Search */}
      <NavbarContent className="sm:flex basis-1/2 sm:basis-1/3" justify="end">
<NavbarItem className="hidden md:flex items-center gap-5">
  {isFeasibilityPage ? (
    <div className="flex items-center gap-5">
      {/* Search Input */}
      <Input
        placeholder="ابحث عن دراسة جدوى..."
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="min-w-[200px]"
      />

      {/* Social Icons */}
      <div className="flex space-x-5">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4267B2] 
                     transform transition-transform duration-300 
                     hover:scale-110 hover:text-[#365899]"        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DA1F2] 
                     transform transition-transform duration-300 
                     hover:scale-110 hover:text-[#0d95e8]"        >
          <FaTwitter size={20} />
        </a>
      </div>
    </div>
) : isAuthenticated  ? (
  <Dropdown
    placement="bottom-end"
    classNames={{
      base: "before:bg-default-200",
      content: "py-1 px-1 border border-default-200 bg-background",
    }}
  >
    <DropdownTrigger>
      <Button
        variant="light"
        className="p-2 bg-transparent gap-2 h-auto"
      >
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={user?.fullName}
          size="sm"
          src={user?.avatar}
        />
        <span className="text-[#1a1a1a] text-[15px]">
          {user?.fullName}
        </span>
      </Button>
    </DropdownTrigger>

    <DropdownMenu
      aria-label="User menu"
      items={dropdownItems || userDropdownItems}
      className="text-right"
      itemClasses={{
        base: "gap-4",
        title: "text-[14px]",
      }}
    >
      {(item) => (
        <DropdownItem
          key={item.key}
          color={item.key === "logout" ? "danger" : "default"}
          className={`${
            item.key === "logout" ? "text-danger" : ""
          } text-right`}
          onClick={() => {
            if (item.action) {
              item.action();
            } else if (item.href) {
              handleNavigation(item.href);
            }
          }}
        >
          {item.label}
        </DropdownItem>
      )}
    </DropdownMenu>
  </Dropdown>
)
 : (
    <div className="flex items-center gap-5">
      {/* Social Icons */}
      <div className="flex space-x-5">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4267B2] 
                     transform transition-transform duration-300 
                     hover:scale-110 hover:text-[#365899]"        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DA1F2] 
                     transform transition-transform duration-300 
                     hover:scale-110 hover:text-[#0d95e8]"        >
          <FaTwitter size={20} />
        </a>
      </div>

      {/* Login Button */}
              <Button
                variant="light"
                className="text-[15px] text-[#1a1a1a] font-normal w-full"
                onClick={() => handleNavigation('/signIn')}
              >
                تسجيل الدخول
              </Button>

    </div>
  )}
</NavbarItem>


      </NavbarContent>

      {/* Mobile Menu Toggle */}
      <NavbarContent className="lg:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6 px-6 pb-6 bg-white">
        {siteConfig.navItems.map((item) => (
          <NavbarMenuItem key={item.href} className="my-3">
            <NavLink href={item.href} className="text-[15px] block py-2">
              {item.label}
            </NavLink>
          </NavbarMenuItem>
        ))}

        <div className="mt-4">
          {isFeasibilityPage ? (
            <Input
              placeholder="ابحث عن دراسة جدوى..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          ) : user ? (
            <div className="flex flex-col gap-2">
              {(dropdownItems || userDropdownItems).map((item) => (
                <Button
                  key={item.key}
                  variant="light"
                  className={`justify-start text-[15px] ${
                    item.key === "logout" ? "text-danger" : "text-[#1a1a1a]"
                  }`}
onClick={() => {
  if (item.action) {
    item.action();
  } else if (item.href) {
    handleNavigation(item.href);
  }
}}                >
                  {item.label}
                </Button>
              ))}
            </div>
          ) : (
            <Button
              variant="light"
              className="text-[15px] text-[#1a1a1a] font-normal w-full"
              onClick={() => handleNavigation("/signIn")}
            >
              تسجيل الدخول
            </Button>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

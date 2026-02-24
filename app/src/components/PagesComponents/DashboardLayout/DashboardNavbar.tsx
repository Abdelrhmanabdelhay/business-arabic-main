"use client";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Logout } from "@/lib/actions/auth";
import { useUserStore } from "@/lib/stores/useUserStore";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const { logout, user } = useUserStore();
  const logoutHandler = async () => {
    await Logout();
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 fixed left-0 top-0 right-0 z-10 shadow-sm shadow-gray-100/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button isIconOnly variant="light" className="lg:hidden text-gray-700" onClick={onMenuClick}>
            <FiMenu size={24} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

          {/* User dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-end hidden sm:block">
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-primary-700">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500"> {user?.email} </div>
                </div>
                <Avatar name={user?.fullName} className="w-9 h-9 transition-transform group-hover:scale-105" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User actions" className="w-56">
              <DropdownItem key="profile" className="text-right">
                <Link href={"/dashboard/profile"}>الملف الشخصي</Link>
              </DropdownItem>
              <DropdownItem key="settings" className="text-right">
                الإعدادات
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger text-right"
                color="danger"
                startContent={<FiLogOut className="text-danger mr-auto" />}
                onClick={logoutHandler}>
                تسجيل الخروج
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

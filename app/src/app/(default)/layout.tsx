"use client";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { UserNavbar } from "@/components/UserNavbar";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useUserStore();

  const isUser = isAuthenticated && user?.role === "user";
  return (
    <div className="relative flex flex-col h-screen">
      {isUser ? <UserNavbar /> : <Navbar />}
      <main className="pb-10 bg-gradient-to-b from-background to-default-100">{children}</main>
      <Footer />
    </div>
  );
}
"use client";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserNavbar } from "@/components/UserNavbar";
import Footer from "@/components/footer";
export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, hasHydrated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated) {
      if (!user) {
        router.push("/signIn");
      } else if (user.role !== "user") {
        router.push("/"); 
      }
    }
  }, [user, hasHydrated]);

  if (!hasHydrated) return null;

return (
  <>
    <UserNavbar />
    <main className="min-h-screen">
      {children}
    </main>
    <Footer />
  </>
);
}
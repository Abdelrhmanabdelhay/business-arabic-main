import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="pb-10 bg-gradient-to-b from-background to-default-100">{children}</main>
      <Footer />
    </div>
  );
}
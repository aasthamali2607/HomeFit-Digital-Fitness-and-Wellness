import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AdminDot from "@/components/AdminDot";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FF]">
      <Navbar />
      <main className={`flex-1 pb-20 lg:pb-0 ${className}`}>
        {children}
      </main>
      <BottomNav />
      <AdminDot />
    </div>
  );
}

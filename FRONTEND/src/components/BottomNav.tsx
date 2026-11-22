import { Link, useLocation } from "@/lib/router-compat";

const ITEMS = [
  {
    to: "/dashboard", label: "Home",
    icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? "text-[#4B5FE8]" : "text-gray-400"}`} fill={a ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/yoga", label: "Yoga",
    icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? "text-[#4B5FE8]" : "text-gray-400"}`} fill={a ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: "/nutrition", label: "Food",
    icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? "text-[#4B5FE8]" : "text-gray-400"}`} fill={a ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    to: "/progress", label: "Progress",
    icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? "text-[#4B5FE8]" : "text-gray-400"}`} fill={a ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: "/profile", label: "Profile",
    icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? "text-[#4B5FE8]" : "text-gray-400"}`} fill={a ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-40 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {ITEMS.map(({ to, label, icon }) => {
          const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
          return (
            <Link key={to} to={to}
              className="flex flex-col items-center justify-center gap-0.5 transition-colors">
              {icon(active)}
              <span className={`text-[10px] font-medium ${active ? "text-[#4B5FE8]" : "text-gray-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

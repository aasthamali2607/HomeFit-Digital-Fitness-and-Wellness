import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";
import { useState } from "react";
import HomeFitLogo from "@/components/HomeFitLogo";

const NAV_LINKS = [
  { to: "/dashboard", label: "Home" },
  { to: "/plan", label: "My Plan" },
  { to: "/exercises", label: "Exercises" },
  { to: "/yoga", label: "Yoga" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/progress", label: "Progress" },
  { to: "/knowledge", label: "Knowledge" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex shrink-0 items-center" aria-label="HomeFit home">
          <HomeFitLogo className="h-11 w-auto max-w-28 sm:max-w-32" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.to || (l.to !== "/dashboard" && pathname.startsWith(l.to));
            return (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-[#4B5FE8] bg-[#EEF1FD]"
                    : "text-gray-600 hover:text-[#4B5FE8] hover:bg-gray-50"
                }`}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                   style={{ background: "linear-gradient(135deg, #4B5FE8, #3B82F6)" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                {user?.name}
              </span>
              <svg className="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.to;
            return (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-[#4B5FE8] bg-[#EEF1FD]" : "text-gray-700 hover:bg-gray-50"
                }`}>
                {l.label}
              </Link>
            );
          })}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <Link to="/profile" onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
            <button onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from "@/lib/router-compat";
import { useApp } from "@/lib/app-context";

/**
 * Discreet bottom-right entry into the team area.
 * Members who aren't on the team never see it.
 */
export default function AdminDot() {
  const { isAdmin } = useApp();
  if (!isAdmin) return null;

  return (
    <Link
      to="/admin"
      aria-label="Admin area"
      title="Admin area"
      className="fixed bottom-20 lg:bottom-5 right-4 z-40 w-9 h-9 rounded-full bg-navy/70 text-white text-xs font-semibold flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
    >
      ⚙
    </Link>
  );
}

import Link from "next/link";
import { User, List, Heart, Settings, LayoutDashboard } from "lucide-react";

export default function UserLayout({ children }) {
  const sidebarLinks = [
    { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/user/profile", icon: User },
    { name: "Watchlist", href: "/user/watchlist", icon: List },
    { name: "Favorites", href: "/user/favorites", icon: Heart },
    { name: "Settings", href: "/user/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-4 flex flex-col gap-2 sticky top-24">
          <h2 className="text-lg font-bold text-(--color-text-primary) mb-2 pb-2 border-b border-(--color-border-custom)">My Account</h2>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-(--color-gold-primary) transition-colors"
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
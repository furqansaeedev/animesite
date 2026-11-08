import Link from "next/link";
import { LayoutDashboard, Film, ListVideo, Users, Settings, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }) {
  const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Anime", href: "/admin/anime", icon: Film },
    { name: "Manage Episodes", href: "/admin/episodes", icon: ListVideo },
    { name: "Manage Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-4 flex flex-col gap-2 sticky top-24">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-(--color-border-custom)">
            <span className="bg-(--color-gold-primary) text-(--color-bg-main) text-xs font-bold px-2 py-1 rounded">ADMIN</span>
            <h2 className="text-lg font-bold text-(--color-text-primary)">Panel</h2>
          </div>
          
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
          
          <hr className="border-(--color-border-custom) my-2" />
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-white transition-colors">
            <ArrowLeft size={18} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-6 md:p-8">
        {children}
      </main>
      
    </div>
  );
}
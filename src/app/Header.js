"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, User, Play, LogOut, Settings, Heart, List, ChevronDown, Shield } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const userMenuRef = useRef(null);

  // Fetch the current user whenever the page changes
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
    
    // Close menus when page changes
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Genres", href: "/genres" },
    { name: "Types", href: "/types" },
    { name: "Updated", href: "/updated" },
    { name: "Ongoing", href: "/ongoing" },
    { name: "Upcoming", href: "/upcoming" },
    { name: "Random", href: "/random" },
  ];

  return (
    <header className="bg-(--color-bg-header) border-b border-(--color-border-custom) sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Play className="text-(--color-gold-primary) fill-current" size={24} />
              <span className="text-xl font-bold text-(--color-gold-primary) tracking-wider">AIME</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search anime..." 
                className="bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-full py-1.5 pl-9 pr-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
              />
              <Search className="absolute left-3 top-1.5 text-(--color-text-secondary)" size={16} />
            </div>

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-(--color-bg-secondary) animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                
                {/* Admin Panel Button (Only visible to Admins) */}
                {user.role === "ADMIN" && (
                  <Link 
                    href="/admin"
                    className="hidden sm:flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-full text-sm font-bold transition-colors"
                  >
                    <Shield size={16} />
                    Admin Panel
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-(--color-bg-card) border border-(--color-border-custom) hover:border-(--color-gold-primary) px-3 py-1.5 rounded-full transition-colors"
                  >
                    <div className="w-6 h-6 bg-(--color-gold-primary) text-(--color-bg-main) rounded-full flex items-center justify-center font-bold text-xs uppercase">
                      {user.email.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-(--color-text-primary) hidden sm:block">My Account</span>
                    <ChevronDown size={14} className="text-(--color-text-secondary)" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-(--color-bg-card) border border-(--color-border-custom) rounded-lg shadow-xl py-2 flex flex-col z-50">
                      <Link href="/user/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-(--color-gold-primary) transition-colors">
                        <List size={16} /> Dashboard
                      </Link>
                      <Link href="/user/watchlist" className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-(--color-gold-primary) transition-colors">
                        <List size={16} /> Watchlist
                      </Link>
                      <Link href="/user/favorites" className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-(--color-gold-primary) transition-colors">
                        <Heart size={16} /> Favorites
                      </Link>
                      <Link href="/user/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-bg-secondary) hover:text-(--color-gold-primary) transition-colors">
                        <Settings size={16} /> Settings
                      </Link>
                      <hr className="border-(--color-border-custom) my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-(--color-bg-secondary) transition-colors w-full text-left">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
              >
                <User size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-(--color-bg-header) border-b border-(--color-border-custom) px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="block text-sm font-medium text-(--color-text-secondary) hover:text-(--color-gold-primary) py-2"
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Admin Link */}
          {user && user.role === "ADMIN" && (
             <Link href="/admin" className="flex items-center gap-2 text-red-400 font-bold py-2 border-t border-(--color-border-custom) pt-4">
               <Shield size={16} /> Admin Panel
             </Link>
          )}
        </div>
      )}
    </header>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", text: "" });

  // Check URL for verification messages
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setNotification({ type: "success", text: "Email verified successfully! You can now log in." });
    } else if (searchParams.get("error")) {
      setNotification({ type: "error", text: "Email verification failed. Please try registering again." });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      router.push("/");
      router.refresh(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <div className="w-full max-w-md bg-(--color-bg-card) border border-(--color-border-custom) rounded-2xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Play className="text-(--color-gold-primary) fill-current" size={32} />
            <span className="text-2xl font-bold text-(--color-gold-primary) tracking-wider">AIME</span>
          </Link>
          <h1 className="text-2xl font-bold text-(--color-text-primary)">Welcome Back</h1>
        </div>

        {notification.text && (
          <div className={`p-3 rounded-lg mb-4 text-sm text-center flex items-center justify-center gap-2 ${notification.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-500" : "bg-red-500/10 border border-red-500/50 text-red-500"}`}>
            {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {notification.text}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 pl-10 pr-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
              />
              <Mail className="absolute left-3 top-3.5 text-(--color-text-secondary)" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 pl-10 pr-10 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-(--color-text-secondary)" size={18} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-(--color-gold-primary) hover:text-(--color-gold-hover) transition-colors">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-(--color-text-secondary) mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-(--color-gold-primary) hover:text-(--color-gold-hover) font-medium transition-colors">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ displayName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Show success message
      setSuccess("Account created! Redirecting to login...");
      
      // Wait 1.5 seconds so the user can read the message, then redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 py-10">
      <div className="w-full max-w-md bg-(--color-bg-card) border border-(--color-border-custom) rounded-2xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Play className="text-(--color-gold-primary) fill-current" size={32} />
            <span className="text-2xl font-bold text-(--color-gold-primary) tracking-wider">AIME</span>
          </Link>
          <h1 className="text-2xl font-bold text-(--color-text-primary)">Create an Account</h1>
          <p className="text-sm text-(--color-text-secondary) mt-2">Join AIME to track your anime</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Display Name</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="OtakuMaster" 
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 pl-10 pr-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
                disabled={isLoading || success}
              />
              <User className="absolute left-3 top-3.5 text-(--color-text-secondary)" size={18} />
            </div>
          </div>

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
                disabled={isLoading || success}
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
                disabled={isLoading || success}
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

          <button 
            type="submit" 
            disabled={isLoading || success}
            className="w-full bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 rounded-lg transition-colors mt-4 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : success ? "Redirecting..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-(--color-text-secondary) mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-(--color-gold-primary) hover:text-(--color-gold-hover) font-medium transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
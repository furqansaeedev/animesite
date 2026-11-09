"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    
    // Strict 8-character check
    if (password.length !== 8) {
      return setError("Password must be exactly 8 characters long.");
    }
    
    // Special character check
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return setError("Password must contain at least one special character (e.g., @, #, $).");
    }

    if (!token) {
      return setError("Invalid or missing reset token");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
        <div className="w-full max-w-md bg-(--color-bg-card) border border-(--color-border-custom) rounded-2xl p-8 shadow-2xl text-center">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-(--color-text-primary) mb-2">Password Reset!</h1>
          <p className="text-(--color-text-secondary)">Your password has been changed successfully.</p>
          <p className="text-sm text-(--color-gold-primary) mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <div className="w-full max-w-md bg-(--color-bg-card) border border-(--color-border-custom) rounded-2xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Play className="text-(--color-gold-primary) fill-current" size={32} />
            <span className="text-2xl font-bold text-(--color-gold-primary) tracking-wider">AIME</span>
          </Link>
          <h1 className="text-2xl font-bold text-(--color-text-primary)">Create New Password</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Exactly 8 chars & 1 special (@, #, $)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 pl-10 pr-10 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-(--color-text-secondary)" size={18} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-(--color-gold-primary)">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
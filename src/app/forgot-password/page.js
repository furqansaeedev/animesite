"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      // Show success message
      setMessage("If an account exists with that email, a password reset link has been sent.");
      
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
          <h1 className="text-2xl font-bold text-(--color-text-primary)">Forgot Password?</h1>
          <p className="text-sm text-(--color-text-secondary) mt-2 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-4 rounded-lg mb-4 text-center flex flex-col items-center gap-2">
            <CheckCircle2 size={24} />
            <span className="font-medium text-base">{message}</span>
            <span className="text-xs opacity-80">Please check your inbox and spam folder.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 pl-10 pr-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
                disabled={!!message}
              />
              <Mail className="absolute left-3 top-3.5 text-(--color-text-secondary)" size={18} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !!message}
            className="w-full bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/chat");
        router.refresh();
      }
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/chat`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Magic link sent! Check your email.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream dot-grid flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-charcoal tracking-tight">
            tasu
          </span>
          <span className="text-xs text-warm-gray">.ai</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-warm-gray">
              {isSignUp
                ? "Start building with your AI co-founder"
                : "Your AI co-founder is waiting"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-charcoal mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition"
                placeholder="you@startup.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-charcoal mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition"
                placeholder="Min 6 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading
                ? "..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-dark" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-cream px-3 text-xs text-warm-gray">or</span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full border border-cream-dark bg-white hover:bg-cream-dark/30 text-charcoal font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            Send magic link
          </button>

          <p className="text-center text-sm text-warm-gray mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setMessage("");
              }}
              className="text-terracotta hover:text-terracotta-dark font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

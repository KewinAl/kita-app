"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/prototype";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSupabase) {
      setMessage("Supabase env vars are not configured.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) setMessage(err.message);
      else setMessage("Check your email for the login link.");
    } catch {
      setMessage("Could not send magic link.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSupabase) {
      setMessage("Supabase env vars are not configured.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) setMessage(err.message);
      else window.location.assign(next.startsWith("/") ? next : `/${next}`);
    } catch {
      setMessage("Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!hasSupabase) {
    return (
      <>
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure{" "}
          <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          to enable Supabase Auth.
        </p>
        <Link href="/" className="mt-4 text-sm text-primary underline">
          Back home
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Demo: magic link (email) or password if enabled in Supabase.
      </p>

      {error ? (
        <p className="mt-2 text-sm text-destructive">Error: {error}</p>
      ) : null}
      {message ? (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      ) : null}

      <form onSubmit={handleMagicLink} className="mt-6 space-y-3">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border bg-background px-3 py-2 text-sm"
          autoComplete="email"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Send magic link
        </Button>
      </form>

      <form onSubmit={handlePassword} className="mt-6 space-y-3 border-t pt-6">
        <p className="text-xs font-medium text-muted-foreground">Password (optional)</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border bg-background px-3 py-2 text-sm"
          autoComplete="current-password"
          placeholder="Only if user has password in Supabase"
        />
        <Button type="submit" variant="outline" className="w-full" disabled={loading}>
          Sign in with password
        </Button>
      </form>

      <Link href="/" className="mt-8 text-center text-sm text-muted-foreground hover:underline">
        Back home
      </Link>
    </>
  );
}

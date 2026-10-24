"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = mode === "login"
        ? await authClient.signIn.email({ email, password, callbackURL: "/" })
        : await authClient.signUp.email({ email, password, name, callbackURL: "/" });
      if (result.error) throw new Error(result.error.message || "Authentication failed");
      onAuthenticated();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F7FB] px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-[#E8EAF2] bg-white p-8 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#655BDF]">Zynqo AI</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#292C40]">{mode === "login" ? "Welcome back" : "Create your workspace"}</h1>
          <p className="mt-1 text-sm text-[#70758B]">Your tasks, documents, and calendar stay private to your account.</p>
        </div>
        {mode === "signup" && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-[#E3E5EF] px-3 py-2 text-sm" />}
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-lg border border-[#E3E5EF] px-3 py-2 text-sm" />
        <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" className="w-full rounded-lg border border-[#E3E5EF] px-3 py-2 text-sm" />
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-[#655BDF] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="w-full text-sm text-[#655BDF]">{mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}</button>
      </form>
    </main>
  );
}

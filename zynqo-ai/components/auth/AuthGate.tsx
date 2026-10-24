"use client";

import AuthScreen from "@/components/auth/AuthScreen";
import { authClient } from "@/lib/auth-client";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-[#70758B]">Loading workspace...</main>;
  }
  if (!session) return <AuthScreen onAuthenticated={() => undefined} />;
  return children;
}

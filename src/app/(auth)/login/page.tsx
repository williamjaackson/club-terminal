"use client";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>You cannot access this resource unless you are signed in.</div>;
  }

  return <div>You are signed in.</div>;
}

"use client";

import { SignInButton } from "./SignInButton";
import { useAuth } from "@/hooks/useAuth";
import { ProfileButton } from "./ProfileButton";

export function AuthButton() {
  const { user } = useAuth();

  if (user) {
    return <ProfileButton user={user} />;
  }
  return <SignInButton />;
}

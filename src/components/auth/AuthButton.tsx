"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { SignInButton } from "./SignInButton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { ProfileButton } from "./ProfileButton";

export function AuthButton() {
  const { user, loading } = useAuth();

  if (user) {
    return <ProfileButton user={user} />;
  }
  return <SignInButton />;
}

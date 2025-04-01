"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { supabase } = useAuth();

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    redirect("/");
  };

  return (
    <Button onClick={handleSignOut} variant="destructive">
      <LogOut />
      <span>Sign out</span>
    </Button>
  );
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { SignInButton } from "./SignInButton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return <SignInButton />;
  }

  return (
    <div className="flex items-center gap-2">
      {user.user_metadata?.avatar_url && (
        <Image
          src={user.user_metadata.avatar_url}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="text-destructive hover:text-destructive"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </div>
  );
}

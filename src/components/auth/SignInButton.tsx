"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleSignIn} className="flex items-center gap-2">
      Sign in with Discord
    </Button>
  );
}

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
export function ProfileButton({ user }: { user: User }) {
  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 h-10"
      asChild
    >
      <Link href="/profile">
        {user.user_metadata?.avatar_url && (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Profile"
            width={25}
            height={25}
            className="rounded-full"
          />
        )}
        <span>{user.user_metadata.full_name}</span>
      </Link>
    </Button>
  );
}

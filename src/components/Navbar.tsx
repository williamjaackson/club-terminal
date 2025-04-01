import Link from "next/link";
import { SquareTerminal } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl flex items-center gap-2">
              <SquareTerminal className="h-6 w-6" />
              Club Terminal
            </Link>
          </div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

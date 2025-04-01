import Link from "next/link";
import { SquareTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto max-w-8xl">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl flex items-center gap-2">
              <SquareTerminal className="h-6 w-6" />
              Club Terminal
            </Link>
          </div>
          <Button variant="outline">Log in</Button>
        </div>
      </div>
    </nav>
  );
}

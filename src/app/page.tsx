import { AppGrid } from "@/components/AppGrid";
import { redirect } from "next/navigation";

export default function Home() {
  // redirect to /apps
  return redirect("/apps");
}

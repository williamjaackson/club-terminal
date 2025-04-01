import { Navbar } from "@/components/Navbar";
import { AppGrid } from "@/components/AppGrid";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container max-w-7xl mx-auto p-4">
        <AppGrid />
      </div>
    </>
  );
}

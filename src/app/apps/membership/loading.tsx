import { LoadingState } from "@/components/LoadingState";

export default function MembershipLoading() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Membership Growth</h1>
      <LoadingState text="Loading membership data..." />
    </div>
  );
}

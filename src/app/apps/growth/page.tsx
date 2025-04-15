import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { GrowthChart } from "./GrowthChart";

export default async function MembershipPage() {
  const clubStarted = new Date("2025-02-18");

  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("ClubMember")
    .select("campus_user, signup_date")
    .order("signup_date", { ascending: true });

  if (error) {
    console.error("Error fetching membership data:", error);
    return <div>Error loading membership data</div>;
  }

  // Process data (same logic as before)
  const now = new Date();
  let brokenMembers = 0;
  data.forEach((entry: any) => {
    let signupDate = new Date(entry.signup_date);

    if (
      isNaN(signupDate.getTime()) ||
      signupDate > now ||
      signupDate < clubStarted
    ) {
      const [year, day, month] = entry.signup_date.split("-");
      const reformattedDate = `${year}-${month}-${day}`;
      const alternativeDate = new Date(reformattedDate);

      if (!isNaN(alternativeDate.getTime()) && alternativeDate <= now) {
        brokenMembers++;
        entry.signup_date = reformattedDate;
      }

      // check if the new signup date is outside the window
      if (
        new Date(entry.signup_date) > now ||
        new Date(entry.signup_date) < clubStarted
      ) {
        // give them a random date between the first member and now
        entry.signup_date = new Date(
          Math.random() * (now.getTime() - clubStarted.getTime()) +
            clubStarted.getTime()
        )
          .toISOString()
          .split("T")[0];
      }
    }
  });

  // Create unique users map
  const uniqueUsers = new Map();
  data.forEach((entry: any) => {
    if (
      !uniqueUsers.has(entry.campus_user) ||
      new Date(entry.signup_date) < new Date(uniqueUsers.get(entry.campus_user))
    ) {
      uniqueUsers.set(entry.campus_user, entry.signup_date);
    }
  });

  // Convert to array and sort
  const uniqueData = Array.from(uniqueUsers.entries())
    .map(([user, date]) => ({ campus_user: user, signup_date: date }))
    .sort(
      (a, b) =>
        new Date(a.signup_date).getTime() - new Date(b.signup_date).getTime()
    );

  // Process data for chart
  const firstDate = new Date(uniqueData[0].signup_date);
  const lastDate = new Date();
  firstDate.setMonth(0);
  firstDate.setDate(1);

  const processedData = [];
  const currentDate = new Date(firstDate);

  while (currentDate <= lastDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const memberCount = uniqueData.filter(
      (user) => new Date(user.signup_date) <= currentDate
    ).length;

    processedData.push({
      date: dateStr,
      members: memberCount,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Membership Growth</h1>
      <Suspense fallback={<LoadingState text="Loading chart..." />}>
        <GrowthChart data={processedData} />
      </Suspense>
      <span className="text-sm text-gray-500 text-center">
        {brokenMembers} members are outside the window and have been placed
        randomly.
      </span>
    </div>
  );
}

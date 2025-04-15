"use client";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export default function MembershipPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [brokenMembers, setBrokenMembers] = useState(0);
  const { supabase, loading } = useAuth();
  const [membershipData, setMembershipData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("ClubMember")
        .select("campus_user, signup_date")
        .order("signup_date", { ascending: true });

      if (error) {
        console.error("Error fetching membership data:", error);
      } else {
        // Log any members with invalid dates and try alternative format
        const now = new Date();
        let brokenMembers = 0;
        data.forEach((entry: any) => {
          let signupDate = new Date(entry.signup_date);

          // If the date is invalid or in the future, try YYYY-DD-MM format
          if (isNaN(signupDate.getTime()) || signupDate > now) {
            // Try parsing as YYYY-DD-MM
            const [year, day, month] = entry.signup_date.split("-");
            const reformattedDate = `${year}-${month}-${day}`;
            const alternativeDate = new Date(reformattedDate);

            if (!isNaN(alternativeDate.getTime()) && alternativeDate <= now) {
              brokenMembers++;
              // Update the entry with the correct date format
              entry.signup_date = reformattedDate;
            } else {
              console.log(
                "Member with suspicious signup date (failed both formats):",
                {
                  user: entry.campus_user,
                  signup_date: entry.signup_date,
                  attempted_fix: reformattedDate,
                  issue: isNaN(signupDate.getTime())
                    ? "Invalid date format"
                    : "Future date",
                }
              );
            }
          }
        });

        // Create a map to keep track of unique users and their earliest signup date
        const uniqueUsers = new Map();
        data.forEach((entry: any) => {
          if (
            !uniqueUsers.has(entry.campus_user) ||
            new Date(entry.signup_date) <
              new Date(uniqueUsers.get(entry.campus_user))
          ) {
            uniqueUsers.set(entry.campus_user, entry.signup_date);
          }
        });

        // Convert map to array and sort by date
        const uniqueData = Array.from(uniqueUsers.entries())
          .map(([user, date]) => ({ campus_user: user, signup_date: date }))
          .sort(
            (a, b) =>
              new Date(a.signup_date).getTime() -
              new Date(b.signup_date).getTime()
          );

        // Get first and last dates
        const firstDate = new Date(uniqueData[0].signup_date);
        const lastDate = new Date(); // Use current date instead of last signup

        // Adjust firstDate to January 1st of its year
        firstDate.setMonth(0);
        firstDate.setDate(1);

        // Create array of all dates between first signup and now
        const processedData = [];
        const currentDate = new Date(firstDate);

        while (currentDate <= lastDate) {
          const dateStr = currentDate.toISOString().split("T")[0];
          // Count members who signed up on or before this date
          const memberCount = uniqueData.filter(
            (user) => new Date(user.signup_date) <= currentDate
          ).length;

          processedData.push({
            date: dateStr,
            members: memberCount,
          });

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setBrokenMembers(brokenMembers);
        setMembershipData(processedData);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [supabase]);

  if (loading || isLoading) {
    return <LoadingState text="Loading membership data..." />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Membership Growth</h1>
      <ChartContainer
        config={{
          label: { label: "Membership Growth" },
          color: { color: "#ff0000" },
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={membershipData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              label={{ value: "Date", position: "bottom" }}
              tickFormatter={(date) => {
                const d = new Date(date);
                // Only show label if it's the first day of the month
                return d.getDate() === 1
                  ? d.toLocaleString("default", { month: "short" })
                  : "";
              }}
              interval={0}
            />
            <YAxis
              label={{ value: "Total Members", angle: -90, position: "left" }}
              domain={[0, "dataMax"]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="members"
              stroke="#ff0000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <span className="text-sm text-gray-500 text-center">
        {brokenMembers} members are outside the window, and have been corrected.
        As the window expands they become less accurate.
      </span>
    </div>
  );
}

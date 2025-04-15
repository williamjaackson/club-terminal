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
          color: { color: "#8884d8" },
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={membershipData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              label={{ value: "Date", position: "bottom" }}
            />
            <YAxis
              label={{ value: "Total Members", angle: -90, position: "left" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="members"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

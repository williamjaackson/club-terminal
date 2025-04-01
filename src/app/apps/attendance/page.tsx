"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface User {
  discord_user_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
}

export default function AttendancePage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("system_users")
        .select("*")
        .not("discord_user_id", "is", null)
        .not("campus_user_id", "is", null);

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <div
            key={user.discord_user_id}
            className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Discord ID: {user.discord_user_id}
              </div>
              <div>
                <div className="font-medium">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Student #: {user.student_number}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

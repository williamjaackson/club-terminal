"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  discord_user_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
}

export default function AttendancePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());

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

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.student_number.toLowerCase().includes(searchLower) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  const toggleCheckIn = (userId: string) => {
    if (checkedIn.has(userId)) {
      setCheckedIn((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } else {
      setCheckedIn((prev) => {
        const newSet = new Set(prev);
        newSet.add(userId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold mb-2">Attendance</h1>
      <div className="flex gap-2 justify-between">
        <Input
          placeholder="Search by name or student number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">Add User</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Student Number</TableHead>
              <TableHead>Discord ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.discord_user_id}>
                <TableCell className="font-medium">
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.student_number}</TableCell>
                <TableCell>{user.discord_user_id}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button variant="ghost">Edit</Button>
                  {checkedIn.has(user.discord_user_id) ? (
                    <Button
                      variant="default"
                      onClick={() => toggleCheckIn(user.discord_user_id)}
                      className="w-24"
                    >
                      Check Out
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => toggleCheckIn(user.discord_user_id)}
                      className="w-24"
                    >
                      Check In
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

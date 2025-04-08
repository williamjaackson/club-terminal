"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { EditUserModal } from "./EditUserModal";
import { AddUserModal } from "./AddUserModal";
import { useUsers } from "../hooks/useUsers";
import { LoadingState } from "@/components/LoadingState";

export function UserTable() {
  const { users, isLoading } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());

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
    toast(
      `${checkedIn.has(userId) ? "Checked out" : "Checked in"} ${
        users.find((user) => user.campus_user_id === userId)?.first_name
      } ${users.find((user) => user.campus_user_id === userId)?.last_name}`,
      {}
    );
  };

  if (isLoading) {
    return <LoadingState text="Loading users..." />;
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-between">
        <Input
          placeholder="Search by name or student number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <AddUserModal />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Student Number</TableHead>
              <TableHead>Campus ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.campus_user_id}>
                <TableCell className="font-medium">
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.student_number}</TableCell>
                <TableCell>{user.campus_user_id}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <EditUserModal user={user} />
                  {checkedIn.has(user.campus_user_id) ? (
                    <Button
                      variant="default"
                      onClick={() => toggleCheckIn(user.campus_user_id)}
                      className="w-24"
                    >
                      Check Out
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => toggleCheckIn(user.campus_user_id)}
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

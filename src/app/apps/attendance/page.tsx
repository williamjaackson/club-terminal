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
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
interface User {
  discord_user_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
}

function AddUserModal() {
  const [studentNumber, setStudentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [joinClub, setJoinClub] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="student-number">Student Number</Label>
          <Input
            id="student-number"
            placeholder="s1234567"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        {/* <DialogDescription>
          
        </DialogDescription> */}
        <div className="flex gap-2">
          <Checkbox
            id="join-club"
            checked={joinClub}
            onCheckedChange={(checked) => setJoinClub(checked as boolean)}
          />
          <Label htmlFor="join-club">
            I acknowledge that by continuing, I agree to let Griffith ICT Club
            track my attendance in this event, and to add me retroactively as a
            member of the club.
          </Label>
        </div>
        <DialogFooter>
          <Button type="submit">Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserModal({ user }: { user: User }) {
  const [studentNumber, setStudentNumber] = useState(user.student_number);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="student-number">Student Number</Label>
          <Input
            id="student-number"
            placeholder="s1234567"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Edit User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
    toast(
      `${checkedIn.has(userId) ? "Checked out" : "Checked in"} ${
        users.find((user) => user.discord_user_id === userId)?.first_name
      } ${users.find((user) => user.discord_user_id === userId)?.last_name}`,
      {}
    );
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
        <AddUserModal />
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
                  <EditUserModal user={user} />
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

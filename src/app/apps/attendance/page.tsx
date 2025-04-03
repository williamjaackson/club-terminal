"use client";

import { UserTable } from "./components/UserTable";

export default function AttendancePage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold mb-2">Attendance</h1>
      <UserTable />
    </div>
  );
}

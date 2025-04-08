"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingState } from "@/components/LoadingState";

function StudentCard({ student }: { student: any }) {
  const isDiscordUser = !!student.discord_user_id;
  const isClubMember = !!student.campus_user_id;

  return (
    <Card className="shadow-sm rounded-md border border-gray-200 gap-2">
      <CardHeader>
        <CardTitle className="text-xl bg-slate-100 rounded-md p-2 w-min">
          {student.student_number ?? "UNDEFINED"}
        </CardTitle>
      </CardHeader>
      {/* {isClubMember && (
        <CardHeader>
          <CardTitle>
            {student.first_name} {student.last_name}
          </CardTitle>
        </CardHeader>
      )} */}
      <CardContent>
        <div className="grid gap-2">
          {isClubMember && (
            <div>
              <Badge variant="red">Club Member</Badge>
              <div className="flex gap-2 align-middle">
                <p className="font-bold">
                  {student.first_name} {student.last_name}
                </p>
                <div className="text-sm text-gray-500 my-auto">
                  ({student.campus_user_id})
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {student.campus_email}
              </div>
            </div>
          )}
          {isDiscordUser && (
            <div>
              <Badge variant="blurple">Discord User</Badge>
              <div>{student.discord_user_id}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const handleSearch = async () => {
    if (searchQuery.length <= 2) {
      toast.error("Search query must be at least 3 characters");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("all_users")
      .select("*")
      .or(
        `discord_user_id.ilike.%${searchQuery}%,student_number.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,campus_user_id.ilike.%${searchQuery}%`
      );
    // .eq("discord_user_id", searchQuery);

    console.log(data, error);
    if (data) {
      setStudents(data);
    } else {
      toast.error("Error fetching students");
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold mb-2">Student</h1>
      <Label>Discord User ID / Student Number / Name / Campus User ID</Label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Search query..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>
      {isLoading ? (
        <LoadingState text="Loading students..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {students.map((student) => (
            <StudentCard
              key={student.campus_user_id + student.discord_user_id}
              student={student}
            />
          ))}
        </div>
      )}
    </div>
  );
}

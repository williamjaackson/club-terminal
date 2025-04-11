"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "../components/User";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase.from("CampusUser").select("*");

      if (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
        return;
      }

      setUsers(data || []);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, setUsers, isLoading };
}

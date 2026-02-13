import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: "admin" | "member";
  created_at: string;
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("role", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data) {
      setMembers(data as Member[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (name: string, email: string, phone?: string) => {
    const { error } = await supabase
      .from("members")
      .insert({ name, email, phone: phone || null, role: "member" as const });
    if (!error) await fetchMembers();
    return { error };
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) await fetchMembers();
    return { error };
  };

  const transferAdmin = async (currentAdminId: string, newAdminId: string) => {
    // First demote current admin
    const { error: e1 } = await supabase
      .from("members")
      .update({ role: "member" as const })
      .eq("id", currentAdminId);
    if (e1) return { error: e1 };

    // Then promote new admin
    const { error: e2 } = await supabase
      .from("members")
      .update({ role: "admin" as const })
      .eq("id", newAdminId);
    if (!e2) await fetchMembers();
    return { error: e2 };
  };

  const adminMember = members.find((m) => m.role === "admin");

  return { members, loading, addMember, deleteMember, transferAdmin, adminMember, refetch: fetchMembers };
}

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthMember {
  id: string;
  name: string;
  email: string | null;
  role: "admin" | "member";
}

interface AuthContextType {
  member: AuthMember | null;
  loading: boolean;
  login: (email: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "bookgroup_member_email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<AuthMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEY);
    if (savedEmail) {
      lookupMember(savedEmail).then((m) => {
        setMember(m);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const lookupMember = async (email: string): Promise<AuthMember | null> => {
    const { data, error } = await supabase
      .from("members")
      .select("id, name, email, role")
      .ilike("email", email.trim())
      .maybeSingle();

    if (error || !data) return null;
    return data as AuthMember;
  };

  const login = async (email: string) => {
    const m = await lookupMember(email);
    if (!m) {
      return { error: "No member found with that email address." };
    }
    localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
    setMember(m);
    return {};
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMember(null);
  };

  return (
    <AuthContext.Provider value={{ member, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

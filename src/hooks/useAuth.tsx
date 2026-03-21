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
const ACTIVITY_KEY = "bookgroup_last_activity";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<AuthMember | null>(null);
  const [loading, setLoading] = useState(true);

  const updateActivity = () => {
    localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
  };

  // Track user activity
  useEffect(() => {
    const events = ["click", "keydown", "scroll", "mousemove"];
    const handler = () => updateActivity();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, []);

  // Restore session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEY);
    const lastActivity = localStorage.getItem(ACTIVITY_KEY);

    if (savedEmail) {
      const expired = lastActivity && Date.now() - Number(lastActivity) > SESSION_MAX_AGE_MS;
      if (expired) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVITY_KEY);
        setLoading(false);
        return;
      }
      updateActivity();
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
    updateActivity();
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

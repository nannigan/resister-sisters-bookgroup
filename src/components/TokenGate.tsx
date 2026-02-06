import { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AccessContextType {
  token: string;
  isAdmin: boolean;
  adminMemberId: string | null;
  setIsAdmin: (val: boolean) => void;
}

export const useAccessContext = () => {
  const [ctx, setCtx] = useState<AccessContextType | null>(null);
  return ctx;
};

// We'll use a simple context approach via props
export default function TokenGate() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }

    const checkToken = async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("access_token")
        .limit(1)
        .maybeSingle();

      if (error || !data || data.access_token !== token) {
        setValid(false);
      } else {
        setValid(true);
      }
    };

    checkToken();
  }, [token]);

  if (valid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse font-display text-lg text-muted-foreground">
          Loading…
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Invalid or Expired Link
          </h1>
          <p className="text-muted-foreground font-body">
            This link is no longer valid. Please ask your book group admin for the current link.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

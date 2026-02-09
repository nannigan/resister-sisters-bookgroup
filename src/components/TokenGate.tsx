import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function TokenGate() {
  const { token } = useParams<{ token: string }>();
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }

    const checkToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('validate-token', {
          body: { token },
        });

        if (error || !data?.valid) {
          setValid(false);
        } else {
          setValid(true);
        }
      } catch {
        setValid(false);
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

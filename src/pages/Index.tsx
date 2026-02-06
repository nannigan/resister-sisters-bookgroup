import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("access_token")
        .limit(1)
        .maybeSingle();

      if (data?.access_token) {
        navigate(`/app/${data.access_token}`, { replace: true });
      } else {
        setLoading(false);
      }
    };
    redirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <BookOpen className="h-10 w-10 text-primary" />
          <p className="font-display text-lg text-muted-foreground">
            Loading your book group…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Book Group
        </h1>
        <p className="font-body text-muted-foreground">
          No access token found. Please use the shared link provided by your
          group admin.
        </p>
      </div>
    </div>
  );
};

export default Index;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function RequireAuth() {
  const { member, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse font-display text-lg text-muted-foreground">
          Loading…
        </div>
      </div>
    );
  }

  if (!member) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, Settings, Vote, LogOut, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/GlobalSearch";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { member, logout } = useAuth();

  const navItems = [
    { to: "/books", label: "Books", icon: BookOpen, exact: false },
    { to: "/topics", label: "Topics", icon: Lightbulb },
    { to: "/vote", label: "Vote", icon: Vote },
    { to: "/members", label: "Members", icon: Users },
    ...(member?.role === "admin"
      ? [{ to: "/admin", label: "Admin", icon: Settings }]
      : []),
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-secondary-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/books" className="flex items-center gap-2 group">
            <BookOpen className="h-5 w-5 text-primary transition-transform group-hover:rotate-[-8deg] shadow-none" />
            <span className="font-display text-lg font-bold text-foreground">Resister Sisters Book Group</span>
          </Link>
          <div className="flex items-center gap-1">
            <GlobalSearch />
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.to, (item as any).exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium font-body transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="ml-2 text-muted-foreground hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container px-4 py-6">{children}</main>
    </div>
  );
}

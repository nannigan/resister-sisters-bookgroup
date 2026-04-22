import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, Settings, Vote, LogOut, Lightbulb, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/GlobalSearch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { member, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        <div className="container px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/books" className="flex items-center gap-2 group min-w-0">
              <BookOpen className="h-5 w-5 text-primary transition-transform group-hover:rotate-[-8deg] shadow-none shrink-0" />
              <span className="font-display text-lg font-bold text-foreground truncate">
                <span className="sm:hidden">Resister Sisters</span>
                <span className="hidden sm:inline">Resister Sisters Book Group</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-1">
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
                          : "text-muted-foreground hover:text-foreground hover:bg-amber-50"
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

            {/* Mobile hamburger */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-amber-50"
                  title="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-display">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-4 flex-1">
                  {navItems.map((item) => {
                    const active = isActive(item.to, (item as any).exact);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium font-body transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-amber-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-border pt-4 mt-4">
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium font-body text-foreground hover:bg-amber-50 w-full transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile search row */}
          <div className="sm:hidden pb-3">
            <GlobalSearch />
          </div>
        </div>
      </header>
      <main className="container px-4 py-6">{children}</main>
    </div>
  );
}

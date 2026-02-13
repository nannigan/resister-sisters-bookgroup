import { Link, useParams, useLocation } from "react-router-dom";
import { BookOpen, Users, Settings } from "lucide-react";

export default function AppLayout({ children }: {children: React.ReactNode;}) {
  const { token } = useParams<{token: string;}>();
  const location = useLocation();
  const base = `/app/${token}`;

  const navItems = [
  { to: base, label: "Books", icon: BookOpen, exact: true },
  { to: `${base}/members`, label: "Members", icon: Users },
  { to: `${base}/admin`, label: "Admin", icon: Settings }];


  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to={base} className="flex items-center gap-2 group">
            <BookOpen className="h-5 w-5 text-primary transition-transform group-hover:rotate-[-8deg] shadow-none" />
            <span className="font-display text-lg font-bold text-foreground">
              Book Group
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium font-body transition-colors ${
                  active ?
                  "bg-primary text-primary-foreground" :
                  "text-muted-foreground hover:text-foreground hover:bg-muted"}`
                  }>

                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>);

            })}
          </nav>
        </div>
      </header>
      <main className="container px-4 py-6">{children}</main>
    </div>);

}
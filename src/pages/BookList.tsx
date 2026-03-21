import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks, Book } from "@/hooks/useBooks";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";

type StatusFilter = "all" | "candidate" | "current" | "finished";
type SortKey = "meeting_date" | "title" | "created_at" | "author" | "status" | "nominator" | "page_count";
type SortDir = "asc" | "desc";

const statusLabels: Record<string, string> = {
  candidate: "Suggested",
  current: "Currently Reading",
  finished: "Finished",
};

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "candidate"
      ? "status-badge-candidate"
      : status === "current"
        ? "status-badge-current"
        : "status-badge-finished";
  return (
    <Badge variant="outline" className={`${cls} font-body text-xs`}>
      {statusLabels[status]}
    </Badge>
  );
}

function SortIcon({ columnKey, sortKey, sortDir }: { columnKey: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (columnKey !== sortKey) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
  return sortDir === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
}

export default function BookList() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { books, loading } = useBooks();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" || key === "author" || key === "nominator" ? "asc" : "desc");
    }
  };
  const filtered = useMemo(() => {
    let result = [...books];
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }
    result.sort((a, b) => {
      let cmp = 0;
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "author": {
          const lastA = a.author.trim().split(/\s+/).pop() || "";
          const lastB = b.author.trim().split(/\s+/).pop() || "";
          cmp = lastA.localeCompare(lastB);
          break;
        }
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "nominator":
          cmp = (a.nominator || "").localeCompare(b.nominator || "");
          break;
        case "page_count":
          cmp = a.page_count - b.page_count;
          break;
        case "meeting_date":
          cmp = (a.meeting_date || "").localeCompare(b.meeting_date || "");
          break;
        case "created_at":
        default:
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return cmp * dir;
    });
    return result;
  }, [books, statusFilter, sortKey, sortDir]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Resister Sisters Books</h1>
          <Button onClick={() => navigate(`/app/${token}/books/new`)} className="font-body">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Book
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[180px] font-body">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="candidate">Suggested</SelectItem>
              <SelectItem value="current">Currently Reading</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body text-lg">
              {statusFilter !== "all"
                ? `No ${statusLabels[statusFilter]?.toLowerCase()} books yet.`
                : "No books added yet. Start by adding your first book!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th
                    onClick={() => toggleSort("title")}
                    className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors bg-accent"
                  >
                    <span className="inline-flex items-center">
                      Title
                      <SortIcon columnKey="title" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("author")}
                    className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden sm:table-cell cursor-pointer select-none hover:text-foreground transition-colors bg-accent"
                  >
                    <span className="inline-flex items-center">
                      Author
                      <SortIcon columnKey="author" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("status")}
                    className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors bg-accent"
                  >
                    <span className="inline-flex items-center">
                      Status
                      <SortIcon columnKey="status" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("meeting_date")}
                    className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden md:table-cell cursor-pointer select-none hover:text-foreground transition-colors bg-accent"
                  >
                    <span className="inline-flex items-center">
                      Meeting Date
                      <SortIcon columnKey="meeting_date" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("nominator")}
                    className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden lg:table-cell cursor-pointer select-none hover:text-foreground transition-colors bg-accent"
                  >
                    <span className="inline-flex items-center">
                      Nominator
                      <SortIcon columnKey="nominator" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("page_count")}
                    className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden lg:table-cell cursor-pointer select-none hover:text-foreground transition-colors bg-accent"
                  >
                    <span className="inline-flex items-center">
                      Pages
                      <SortIcon columnKey="page_count" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr
                    key={book.id}
                    onClick={() => navigate(`/app/${token}/books/${book.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-display font-bold text-foreground">{book.title}</div>
                      <div className="text-sm text-muted-foreground sm:hidden font-body">{book.author}</div>
                    </td>
                    <td className="px-4 py-3 font-body text-foreground hidden sm:table-cell">{book.author}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden md:table-cell">
                      {book.meeting_date ? format(new Date(book.meeting_date + "T00:00:00"), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden lg:table-cell">
                      {book.nominator || "—"}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden lg:table-cell">
                      {book.page_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

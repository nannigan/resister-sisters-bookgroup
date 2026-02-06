import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks, Book } from "@/hooks/useBooks";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUpDown } from "lucide-react";

type StatusFilter = "all" | "candidate" | "current" | "finished";
type SortKey = "meeting_month" | "title" | "created_at";

const statusLabels: Record<string, string> = {
  candidate: "Candidate",
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

export default function BookList() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { books, loading } = useBooks();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");

  const filtered = useMemo(() => {
    let result = [...books];
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "meeting_month") {
        const am = a.meeting_month || "";
        const bm = b.meeting_month || "";
        return am.localeCompare(bm);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return result;
  }, [books, statusFilter, sortKey]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Book Group Reading List
          </h1>
          <Button
            onClick={() => navigate(`/app/${token}/books/new`)}
            className="font-body"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Book
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-[180px] font-body">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="candidate">Candidate</SelectItem>
              <SelectItem value="current">Currently Reading</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortKey}
            onValueChange={(v) => setSortKey(v as SortKey)}
          >
            <SelectTrigger className="w-[180px] font-body">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Recently Added</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="meeting_month">Meeting Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-muted animate-pulse"
              />
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
                  <th className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden sm:table-cell">
                    Author
                  </th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden md:table-cell">
                    Meeting
                  </th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden lg:table-cell">
                    Nominator
                  </th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-sm text-muted-foreground hidden lg:table-cell">
                    Pages
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr
                    key={book.id}
                    onClick={() =>
                      navigate(`/app/${token}/books/${book.id}`)
                    }
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-display font-bold text-foreground">
                        {book.title}
                      </div>
                      <div className="text-sm text-muted-foreground sm:hidden font-body">
                        {book.author}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-foreground hidden sm:table-cell">
                      {book.author}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden md:table-cell">
                      {book.meeting_month || "—"}
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

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Lightbulb, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface SearchResult {
  type: "book" | "topic" | "member";
  id: string;
  title: string;
  subtitle?: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const pattern = `%${term.trim()}%`;

    const [booksRes, topicsRes, membersRes] = await Promise.all([
      supabase
        .from("books")
        .select("id, title, author")
        .or(`title.ilike.${pattern},author.ilike.${pattern}`)
        .limit(5),
      supabase
        .from("topics")
        .select("id, title, submitted_by")
        .or(`title.ilike.${pattern},submitted_by.ilike.${pattern}`)
        .limit(5),
      supabase
        .from("members")
        .select("id, name, email")
        .or(`name.ilike.${pattern},email.ilike.${pattern}`)
        .limit(5),
    ]);

    const items: SearchResult[] = [
      ...(booksRes.data || []).map((b) => ({
        type: "book" as const,
        id: b.id,
        title: b.title,
        subtitle: b.author,
      })),
      ...(topicsRes.data || []).map((t) => ({
        type: "topic" as const,
        id: t.id,
        title: t.title,
        subtitle: t.submitted_by ?? undefined,
      })),
      ...(membersRes.data || []).map((m) => ({
        type: "member" as const,
        id: m.id,
        title: m.name,
        subtitle: m.email ?? undefined,
      })),
    ];

    setResults(items);
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => search(query), 250);
    return () => clearTimeout(timeout);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    if (result.type === "book") navigate(`/books/${result.id}`);
    else if (result.type === "topic") navigate("/topics");
    else if (result.type === "member") navigate("/members");
  };

  const iconMap = {
    book: BookOpen,
    topic: Lightbulb,
    member: Users,
  };

  const labelMap = {
    book: "Book",
    topic: "Topic",
    member: "Member",
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          className="h-8 w-40 sm:w-52 pl-8 pr-8 text-sm font-body bg-muted/50 border-border"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute top-full mt-1 left-0 right-0 sm:w-72 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {loading ? (
            <div className="px-3 py-4 text-sm text-muted-foreground font-body text-center">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground font-body text-center">
              No results found
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {results.map((r) => {
                const Icon = iconMap[r.type];
                return (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-accent transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-body text-foreground truncate">{r.title}</div>
                      {r.subtitle && (
                        <div className="text-xs font-body text-muted-foreground truncate">{r.subtitle}</div>
                      )}
                    </div>
                    <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider shrink-0">
                      {labelMap[r.type]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

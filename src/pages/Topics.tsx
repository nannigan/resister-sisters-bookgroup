import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Topic {
  id: string;
  title: string;
  created_at: string;
}

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("topics")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTopics(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Suggested Topics for Book Ideas
        </h1>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <p className="text-muted-foreground font-body text-lg text-center py-16">
            No topics suggested yet.
          </p>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between"
              >
                <span className="font-body text-foreground">{topic.title}</span>
                <span className="font-body text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {format(new Date(topic.created_at), "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

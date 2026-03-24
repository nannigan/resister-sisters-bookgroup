import { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SuggestTopicDialog from "@/components/SuggestTopicDialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface Topic {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  submitted_by: string | null;
}

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [deleteTopic, setDeleteTopic] = useState<Topic | null>(null);
  const { member } = useAuth();
  const isAdmin = member?.role === "admin";

  const fetchTopics = useCallback(() => {
    supabase
      .from("topics")
      .select("id, title, description, created_at, submitted_by")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTopics(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleDelete = async () => {
    if (!deleteTopic) return;
    const { error } = await supabase.from("topics").delete().eq("id", deleteTopic.id);
    if (error) {
      toast.error("Failed to delete topic.");
    } else {
      toast.success("Topic deleted.");
      fetchTopics();
    }
    setDeleteTopic(null);
  };

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
                <div className="min-w-0">
                  <span className="font-body text-foreground">{topic.title}</span>
                  {topic.submitted_by && (
                    <span className="font-body text-xs text-muted-foreground ml-2">
                      — {topic.submitted_by}
                    </span>
                  )}
                  {topic.description && (
                    <p className="font-body text-sm text-muted-foreground mt-0.5 line-clamp-2">{topic.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="font-body text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(topic.created_at), "MMM d, yyyy")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setEditTopic(topic)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTopic(topic)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SuggestTopicDialog
        editTopic={editTopic}
        open={!!editTopic}
        onOpenChange={(open) => { if (!open) setEditTopic(null); }}
        onSaved={fetchTopics}
        trigger={null}
      />

      <AlertDialog open={!!deleteTopic} onOpenChange={(open) => { if (!open) setDeleteTopic(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTopic?.title}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

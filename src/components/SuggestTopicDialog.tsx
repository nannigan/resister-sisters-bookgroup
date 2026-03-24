import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface SuggestTopicDialogProps {
  editTopic?: { id: string; title: string } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: () => void;
  trigger?: React.ReactNode;
}

export default function SuggestTopicDialog({ editTopic, open: controlledOpen, onOpenChange, onSaved, trigger }: SuggestTopicDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState("");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  useEffect(() => {
    if (open) {
      setTopic(editTopic?.title ?? "");
    }
  }, [open, editTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic.");
      return;
    }
    setSubmitting(true);

    if (editTopic) {
      const { error } = await supabase.from("topics").update({ title: topic.trim() }).eq("id", editTopic.id);
      setSubmitting(false);
      if (error) {
        toast.error("Failed to update topic.");
        return;
      }
      toast.success("Topic updated!");
    } else {
      const { error } = await supabase.from("topics").insert({ title: topic.trim() });
      setSubmitting(false);
      if (error) {
        toast.error("Failed to submit topic.");
        return;
      }
      toast.success("Topic suggested!");
    }

    setTopic("");
    setOpen(false);
    onSaved?.();
  };

  const defaultTrigger = (
    <Button variant="outline" className="font-body">
      <Lightbulb className="h-4 w-4 mr-1.5" />
      Suggest a Topic
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined ? trigger : (
        <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editTopic ? "Edit Topic" : "Suggest a Topic for Brainstorming New Books"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">
            {editTopic ? "Update your topic suggestion." : "Share an idea for the group to explore."}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Textarea
            placeholder="What topic would you like the group to explore?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={submitting} className="w-full font-body">
            {submitting ? "Saving..." : editTopic ? "Update" : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

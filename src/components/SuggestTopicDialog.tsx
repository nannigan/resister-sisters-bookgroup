import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface SuggestTopicDialogProps {
  editTopic?: { id: string; title: string; description?: string | null } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: () => void;
  trigger?: React.ReactNode;
}

export default function SuggestTopicDialog({ editTopic, open: controlledOpen, onOpenChange, onSaved, trigger }: SuggestTopicDialogProps) {
  const { member } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  useEffect(() => {
    if (open) {
      setTitle(editTopic?.title ?? "");
      setDescription(editTopic?.description ?? "");
    }
  }, [open, editTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    setSubmitting(true);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
    };

    if (editTopic) {
      const { error } = await supabase.from("topics").update(payload).eq("id", editTopic.id);
      setSubmitting(false);
      if (error) {
        toast.error("Failed to update topic.");
        return;
      }
      toast.success("Topic updated!");
    } else {
      const { error } = await supabase.from("topics").insert({ ...payload, submitted_by: member?.name ?? null });
      setSubmitting(false);
      if (error) {
        toast.error("Failed to submit topic.");
        return;
      }
      toast.success("Topic suggested!");
    }

    setTitle("");
    setDescription("");
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
          <div className="space-y-1.5">
            <Label htmlFor="topic-title" className="font-body">Title</Label>
            <Input
              id="topic-title"
              placeholder="Short title for your topic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="topic-description" className="font-body">Description</Label>
            <Textarea
              id="topic-description"
              placeholder="Add more detail about what you'd like the group to explore"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full font-body">
            {submitting ? "Saving..." : editTopic ? "Update" : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

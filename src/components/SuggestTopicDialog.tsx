import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SuggestTopicDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", submitted_by: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter a topic title.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("topics").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      submitted_by: form.submitted_by.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit topic.");
      return;
    }
    toast.success("Topic suggested!");
    setForm({ title: "", description: "", submitted_by: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-body">
          <Lightbulb className="h-4 w-4 mr-1.5" />
          Suggest a Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Suggest a Topic for Brainstorming New Books</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="topic-title" className="font-body">Topic Title *</Label>
            <Input
              id="topic-title"
              placeholder="e.g. Climate justice, Historical fiction..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic-desc" className="font-body">Description</Label>
            <Textarea
              id="topic-desc"
              placeholder="Why is this topic interesting? Any specific books in mind?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic-by" className="font-body">Your Name</Label>
            <Input
              id="topic-by"
              placeholder="Optional"
              value={form.submitted_by}
              onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full font-body">
            {submitting ? "Submitting..." : "Submit Topic"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

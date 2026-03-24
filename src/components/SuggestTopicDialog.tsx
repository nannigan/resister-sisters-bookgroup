import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SuggestTopicDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("topics").insert({ title: topic.trim() });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit topic.");
      return;
    }
    toast.success("Topic suggested!");
    setTopic("");
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
          <p className="text-sm text-muted-foreground font-body">Share an idea for the group to explore.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Textarea
            placeholder="What topic would you like the group to explore?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={submitting} className="w-full font-body">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

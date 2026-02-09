import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks, BookInsert } from "@/hooks/useBooks";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Save, ExternalLink, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

export default function BookDetail() {
  const { token, bookId } = useParams<{ token: string; bookId: string }>();
  const navigate = useNavigate();
  const { addBook, updateBook, deleteBook, getBook } = useBooks();
  const isNew = bookId === "new";

  const [form, setForm] = useState({
    title: "",
    author: "",
    status: "candidate" as "candidate" | "current" | "finished",
    publication_date: "",
    page_count: "",
    meeting_date: "",
    nominator: "",
    comment: "",
    link: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && bookId) {
      getBook(bookId).then(({ data }) => {
        if (data) {
          setForm({
            title: data.title,
            author: data.author,
            status: data.status,
            publication_date: data.publication_date,
            page_count: String(data.page_count),
            meeting_date: data.meeting_date || "",
            nominator: data.nominator || "",
            comment: data.comment || "",
            link: data.link || "",
          });
        }
        setLoading(false);
      });
    }
  }, [bookId, isNew]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim() || !form.publication_date || !form.page_count) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const pageCount = parseInt(form.page_count, 10);
    if (isNaN(pageCount) || pageCount <= 0) {
      toast.error("Page count must be a positive number.");
      return;
    }

    setSaving(true);
    const bookData: BookInsert = {
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
      publication_date: form.publication_date,
      page_count: pageCount,
      meeting_date: form.meeting_date || null,
      nominator: form.nominator || null,
      comment: form.comment || null,
      link: form.link || null,
    };

    if (isNew) {
      const { error } = await addBook(bookData);
      if (error) {
        toast.error("Failed to add book.");
      } else {
        toast.success("Book added!");
        navigate(`/app/${token}`);
      }
    } else {
      const { error } = await updateBook(bookId!, bookData);
      if (error) {
        toast.error("Failed to update book.");
      } else {
        toast.success("Book updated!");
        navigate(`/app/${token}`);
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const { error } = await deleteBook(bookId!);
    if (error) {
      toast.error("Failed to delete book.");
    } else {
      toast.success("Book deleted.");
      navigate(`/app/${token}`);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/${token}`)}
            className="font-body"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to list
          </Button>
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="font-body">
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Delete this book?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body">
                    This will permanently remove "{form.title}" from the reading
                    list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground">
          {isNew ? "Add a New Book" : "Edit Book"}
        </h1>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. The Great Gatsby"
                className="font-body"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="e.g. F. Scott Fitzgerald"
                className="font-body"
                maxLength={200}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as "candidate" | "current" | "finished" })
                }
              >
                <SelectTrigger className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="current">Currently Reading</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Publication Date <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.publication_date}
                onChange={(e) =>
                  setForm({ ...form, publication_date: e.target.value })
                }
                placeholder="e.g. 1925 or 1925-04-10"
                className="font-body"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Page Count <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                value={form.page_count}
                onChange={(e) =>
                  setForm({ ...form, page_count: e.target.value })
                }
                placeholder="e.g. 180"
                className="font-body"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-body font-semibold">Meeting Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-body",
                      !form.meeting_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {form.meeting_date
                      ? format(new Date(form.meeting_date + "T00:00:00"), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.meeting_date ? new Date(form.meeting_date + "T00:00:00") : undefined}
                    onSelect={(date) =>
                      setForm({
                        ...form,
                        meeting_date: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">Nominator</Label>
              <Input
                value={form.nominator}
                onChange={(e) =>
                  setForm({ ...form, nominator: e.target.value })
                }
                placeholder="Who suggested it?"
                className="font-body"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold flex items-center gap-1.5">
              Link
              {form.link && (
                <a
                  href={form.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </Label>
            <Input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://..."
              className="font-body"
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold">Group Notes</Label>
            <Textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Shared notes for the group…"
              className="font-body min-h-[100px]"
              maxLength={2000}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto font-body"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "Saving…" : isNew ? "Add Book" : "Save Changes"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

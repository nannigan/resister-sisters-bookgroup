import { useState } from "react";
import { useVotes } from "@/hooks/useVotes";
import { useMembers } from "@/hooks/useMembers";
import AppLayout from "@/components/AppLayout";
import ThemeConfigurator from "@/components/ThemeConfigurator";
import { Button } from "@/components/ui/button";
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
import { Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AdminPanel() {
  const { votes, clearAllVotes } = useVotes();
  const { members, adminMember } = useMembers();
  const [clearing, setClearing] = useState(false);
  const [recipientMode, setRecipientMode] = useState<"bcc" | "cc">("bcc");

  const recipients = members.filter(
    (m) => m.email && m.id !== adminMember?.id,
  );
  const recipientList = recipients.map((m) => m.email).join(",");
  const toPart = adminMember?.email ? encodeURIComponent(adminMember.email) : "";
  const mailtoHref = `mailto:${toPart}?${recipientMode}=${encodeURIComponent(recipientList)}`;

  const handleEmailAll = () => {
    if (recipients.length === 0) {
      toast.error("No members with email addresses to message.");
      return;
    }
    window.location.href = mailtoHref;
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Admin Panel
        </h1>

        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-body font-semibold text-foreground">
                  Email All Members
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  Opens your email app with all members{adminMember ? " (except you)" : ""} in {recipientMode.toUpperCase()}. You send from your own inbox.
                </p>
              </div>
            </div>
            <RadioGroup
              value={recipientMode}
              onValueChange={(v) => setRecipientMode(v as "bcc" | "cc")}
              className="flex gap-4 pl-7"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="bcc" id="mode-bcc" />
                <Label htmlFor="mode-bcc" className="font-body text-sm cursor-pointer">
                  BCC <span className="text-muted-foreground">(private)</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cc" id="mode-cc" />
                <Label htmlFor="mode-cc" className="font-body text-sm cursor-pointer">
                  CC <span className="text-muted-foreground">(visible, reply-all)</span>
                </Label>
              </div>
            </RadioGroup>
            <Button
              variant="outline"
              onClick={handleEmailAll}
              disabled={recipients.length === 0}
              className="font-body bg-amber-50"
            >
              <Mail className="h-4 w-4 mr-1.5" />
              Compose Email ({recipients.length} recipient{recipients.length !== 1 ? "s" : ""})
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Trash2 className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-body font-semibold text-foreground">
                  Reset Voting Round
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  Clear all votes to start a fresh voting round. This cannot be undone.
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={clearing || votes.length === 0}
                  className="font-body border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className={`h-4 w-4 mr-1.5 ${clearing ? "animate-spin" : ""}`} />
                  {clearing ? "Clearing…" : `Clear All Votes (${votes.length})`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Clear all votes?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body">
                    This will permanently delete all {votes.length} vote{votes.length !== 1 ? "s" : ""} and reset the results. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      setClearing(true);
                      const { error } = await clearAllVotes();
                      if (error) {
                        toast.error("Failed to clear votes.");
                      } else {
                        toast.success("All votes cleared!");
                      }
                      setClearing(false);
                    }}
                    className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All Votes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <ThemeConfigurator />
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { useVotes } from "@/hooks/useVotes";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { votes, clearAllVotes } = useVotes();
  const [clearing, setClearing] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Admin Panel
        </h1>

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

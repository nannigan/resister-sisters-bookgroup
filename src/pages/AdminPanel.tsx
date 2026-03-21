import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import AppLayout from "@/components/AppLayout";
import ThemeConfigurator from "@/components/ThemeConfigurator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RefreshCw, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { regenerateToken } = useAppSettings();
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/app/${token}`
      : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!token) return;
    setRegenerating(true);
    const { error, newToken } = await regenerateToken(token);
    if (error) {
      toast.error("Failed to regenerate link.");
    } else if (newToken) {
      toast.success("Link regenerated! Redirecting…");
      setTimeout(() => {
        navigate(`/app/${newToken}/admin`, { replace: true });
      }, 500);
    }
    setRegenerating(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Admin Panel
        </h1>

        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <div className="space-y-2">
            <Label className="font-body font-semibold">
              Current Shared Link
            </Label>
            <div className="flex gap-2">
              <Input
                value={currentUrl}
                readOnly
                className="font-body text-sm bg-muted"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Share this link with your book group members.
            </p>
          </div>

          <div className="border-t border-border pt-5 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-body font-semibold text-foreground">
                  Regenerate Access Link
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  This will invalidate the current link. All members will need
                  the new link to access the app.
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={regenerating}
                  className="font-body"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1.5 ${
                      regenerating ? "animate-spin" : ""
                    }`}
                  />
                  {regenerating ? "Regenerating…" : "Regenerate Link"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Regenerate access link?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body">
                    The current link will stop working immediately. You'll need
                    to share the new link with all group members.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRegenerate}
                    className="font-body"
                  >
                    Regenerate
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

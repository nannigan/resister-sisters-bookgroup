import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { member, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && member) {
      navigate("/books", { replace: true });
    }
  }, [member, loading, navigate]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) return;

    setSubmitting(true);
    const result = await login(trimmed);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate("/books");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm w-full">
        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Resister Sisters Book Group
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          Enter your email address to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="your@email.com"
            className="text-center"
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive font-body">{error}</p>
          )}
          <Button type="submit" disabled={!email.trim() || submitting}>
            {submitting ? "Checking…" : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;

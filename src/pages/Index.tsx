import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (trimmed) {
      navigate(`/app/${trimmed}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm w-full">
        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Book Group
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          Enter your group's access code to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your access code"
            className="text-center"
            autoFocus
          />
          <MovingBorderButton
            containerClassName="w-full h-10"
            className="font-body"
            type="submit"
            disabled={!token.trim()}
          >
            Enter
          </MovingBorderButton>
        </form>
      </div>
    </div>
  );
};

export default Index;

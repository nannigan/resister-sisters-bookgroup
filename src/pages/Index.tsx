import { BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Book Group
        </h1>
        <p className="font-body text-muted-foreground">
          Please use the shared link provided by your group admin to access the
          app.
        </p>
      </div>
    </div>
  );
};

export default Index;

import { Loader2 } from "lucide-react";

export default function Loading() {
  // Global loading state using a simple spinning loader
  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center flex flex-col items-center">
        <div className="p-6 bg-destructive/10 rounded-full mb-6 text-destructive">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="font-heading text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()} className="rounded-full px-8">
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} className="rounded-full px-8">
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}

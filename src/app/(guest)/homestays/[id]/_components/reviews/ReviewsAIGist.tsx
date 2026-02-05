import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";
import { Sparkles } from "lucide-react";

interface ReviewsAIGistProps {
  summary: string | null;
  loading: boolean;
  reviewCount: number;
  minRequired: number;
}

export default function ReviewsAIGist({
  summary,
  loading,
  reviewCount,
  minRequired,
}: ReviewsAIGistProps) {
  return (
    <div className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-2">
      <h3 className="text-sm font-medium text-mitti-dark-brown flex gap-2 items-center justify-start">
        <Sparkles size={18} /> AI Generated Summary
      </h3>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )}

      {!loading && reviewCount < minRequired && (
        <p className="text-sm text-mitti-dark-brown/70">
          A summary will appear once at least {minRequired} guest reviews are
          available.
        </p>
      )}

      {!loading && reviewCount >= minRequired && !summary && (
        <p className="text-sm text-mitti-dark-brown/70">
          We could not generate a summary at the moment.
        </p>
      )}

      {!loading && summary && (
        <p className="text-sm text-mitti-dark-brown/80 leading-relaxed">
          {summary}
        </p>
      )}
    </div>
  );
}

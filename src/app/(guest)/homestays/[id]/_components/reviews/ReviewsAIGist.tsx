import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";
import { Sparkles } from "lucide-react";

interface ReviewsAIGistProps {
  summary: string | null;
  positives: string[] | null;
  negatives: string[] | null;
  loading: boolean;
  reviewCount: number;
  minRequired: number;
}

export default function ReviewsAIGist({
  summary,
  positives,
  negatives,
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
        <div className="space-y-3">
          <p className="text-sm text-mitti-dark-brown/80 leading-relaxed">
            {summary}
          </p>

          {Array.isArray(positives) && positives.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {positives.map((item, index) => (
                <span
                  key={`pos-${index}-${item}`}
                  className="text-xs rounded-full px-2.5 py-1 bg-mitti-beige text-mitti-dark-brown/90"
                >
                  • {item}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(negatives) && negatives.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {negatives.map((item, index) => (
                <span
                  key={`neg-${index}-${item}`}
                  className="text-xs rounded-full px-2.5 py-1 bg-mitti-khaki/40 text-mitti-dark-brown/65"
                >
                  • {item}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

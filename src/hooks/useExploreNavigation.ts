"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
  normalizeExploreQueryParams,
  serializeExploreQuery,
  type ExploreQueryParams,
} from "./useExploreQuery";

export function useExploreNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(updates: ExploreQueryParams) {
    const currentRaw = qs.parse(searchParams.toString(), {
      arrayFormat: "comma",
    });

    const current = normalizeExploreQueryParams(
      currentRaw as Partial<Record<keyof ExploreQueryParams, unknown>>,
    );
    const next = normalizeExploreQueryParams({
      ...current,
      ...updates,
    });

    const queryString = serializeExploreQuery(next);
    const nextUrl = queryString ? `/explore?${queryString}` : "/explore";
    const currentQuery = searchParams.toString();
    const currentUrl = currentQuery ? `/explore?${currentQuery}` : "/explore";

    if (currentUrl === nextUrl) return;

    router.replace(nextUrl, { scroll: false });
  }

  return { updateQuery };
}

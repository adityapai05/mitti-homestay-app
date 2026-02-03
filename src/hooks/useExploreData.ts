"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { serializeExploreQuery, useExploreQuery } from "./useExploreQuery";
import type { Homestay } from "@/types";

interface ExploreResponse {
  homestays: Homestay[];
  totalPages: number;
}

export function useExploreData() {
  const query = useExploreQuery();

  const queryString = useMemo(
    () => serializeExploreQuery(query),
    [query],
  );

  const [data, setData] = useState<ExploreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);
      setError(false);

      try {
        const url = queryString
          ? `/api/homestays?${queryString}`
          : "/api/homestays";
        const response = await axios.get<ExploreResponse>(url);

        if (active) setData(response.data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [queryString]);

  return {
    homestays: data?.homestays ?? [],
    totalPages: data?.totalPages ?? 1,
    loading,
    error,
  };
}

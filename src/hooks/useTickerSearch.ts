import { useState, useEffect } from "react";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";

type SearchTicker = {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string;
};

export function useTickerSearch(query: string) {
  return useQuery<SearchTicker[]>({
    queryKey: ["ticker-search", query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const response = await api.get(
        `api/ticker/${query}`);

      return response.data;
    },
    enabled: !!query && query.trim().length > 0, 
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
    // Debouncing is handled by React Query automatically with same queryKey
  });
}




export function useDebouncedTickerSearch(query: string, delay: number = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return useTickerSearch(debouncedQuery);
}
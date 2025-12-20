import type { NewsItem } from "@/components/features/news/components/news-card";
import { useMemo } from "react";


export const useNewsFilters = (
  news: NewsItem[],
  sortBy: "newest" | "oldest" | "relevance",
  filterSource: string
) => {
  return useMemo(() => {
    let filtered = [...news];
    
    if (filterSource !== "all") {
      filtered = filtered.filter(item => 
        item.source?.toLowerCase().includes(filterSource.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.datetime || 0).getTime() - new Date(a.datetime || 0).getTime();
        case "oldest":
          return new Date(a.datetime || 0).getTime() - new Date(b.datetime || 0).getTime();
        case "relevance":
          return (b.summary?.length || 0) - (a.summary?.length || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [news, sortBy, filterSource]);
};
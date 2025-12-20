import { useQuery } from "@tanstack/react-query";
import type { NewsItem } from "@/components/features/news/components/news-card";
import api from "@/lib/axios-config";

const newsKeys = {
  all: ["news"] as const,
  category: (category: string) => [...newsKeys.all, "category", category] as const,
  company: (symbol: string, range: string) => [...newsKeys.all, "company", symbol, range] as const,
};

const fetchNews = async (
  type: string,
  category: string,
  symbol: string,
  range: string
): Promise<NewsItem[]> => {
  let endpoint = "";

  if (type === "trending" || (type === "category" && !category)) {
    endpoint = `/api/newsList/category?category=general`;
  } else if (type === "category" && category) {
    endpoint = `/api/newsList/category?category=${category}`;
  } else if (type === "company" && symbol) {
    const to = Math.floor(Date.now() / 1000);
    let from = to - 7 * 24 * 60 * 60;
    if (range === "1d") from = to - 1 * 24 * 60 * 60;
    if (range === "30d") from = to - 30 * 24 * 60 * 60;

    endpoint = `/api/newsList/company-news/${symbol}?from=${from}&to=${to}`;
  }

  const response = await api.get(endpoint);
  return response.data;
};

export const useNewsQuery = (
  type: string,
  category: string,
  symbol: string,
  range: string
) => {
  return useQuery({
    queryKey: type === "company" 
      ? newsKeys.company(symbol, range)
      : newsKeys.category(category),
    queryFn: () => fetchNews(type, category, symbol, range),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: type === "company" ? !!symbol : true,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

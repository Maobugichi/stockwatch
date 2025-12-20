import type { NewsItem } from "@/types";
import { useRef, useState, type ReactNode } from "react";
import { NewsContext } from "./newsContext";
import type { SortBy } from "../types/newsType";

export const NewsProvider = ({
  children,
  symbol,
  range,
}: {
  children: ReactNode;
  symbol: string;
  range: string;
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [search, setSearch] = useState(symbol);
  const [companyRange, setCompanyRange] = useState(range);
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filterSource, setFilterSource] = useState("all");

  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("newsRecentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <NewsContext.Provider
      value={{
        news,
        loading,
        refreshing,
        showScrollTop,
        autoRefresh,

        search,
        companyRange,
        sortBy,
        filterSource,

        currentPage,
        itemsPerPage,

        bookmarked,
        recentSearches,

        newsContainerRef,

        setNews,
        setLoading,
        setRefreshing,
        setShowScrollTop,
        setAutoRefresh,

        setSearch,
        setCompanyRange,
        setSortBy,
        setFilterSource,

        setCurrentPage,
        setBookmarked,
        setRecentSearches,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

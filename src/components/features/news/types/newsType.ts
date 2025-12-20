import type { NewsItem } from "@/types";

export type SortBy = "newest" | "oldest" | "relevance";

export interface NewsContextValue {

  news: NewsItem[];
  loading: boolean;
  refreshing: boolean;


  showScrollTop: boolean;
  autoRefresh: boolean;


  search: string;
  companyRange: string;
  sortBy: SortBy;
  filterSource: string;


  currentPage: number;
  itemsPerPage: number;


  bookmarked: Set<string>;
  recentSearches: string[];

  newsContainerRef: React.RefObject<HTMLDivElement | null>;


  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowScrollTop: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;

  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setCompanyRange: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  setFilterSource: React.Dispatch<React.SetStateAction<string>>;

  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setBookmarked: React.Dispatch<React.SetStateAction<Set<string>>>;
  setRecentSearches: React.Dispatch<React.SetStateAction<string[]>>;
}
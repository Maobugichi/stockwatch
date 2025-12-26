import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp } from "lucide-react";
import { NewsTabs } from "@/components/features/news/components/newsTabs";
import { useNewsQuery } from "@/components/features/news/hook/useNewsQuery";
import { useBookmarks } from "@/components/features/news/hook/useBookmarks";
import { useRecentSearches } from "@/components/features/news/hook/useRecentSearches";
import { useNewsFilters } from "@/components/features/news/hook/useNewsFilters";
import { usePagination } from "@/components/features/news/hook/usePagination";
import { NewsFilters } from "@/components/features/news/components/newsFilters";
import { CompanySearch } from "@/components/features/news/components/companySearch";
import { NewsPagination } from "@/components/features/news/components/newsPagination";
import { NewsGrid } from "@/components/features/news/components/newsGrid";


import type { NewsItem } from "@/components/features/news/components/news-card";

const NewsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") || "category";
  const category = searchParams.get("category") || "general";
  const symbol = searchParams.get("symbol") || "";
  const range = searchParams.get("range") || "7d";

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [search, setSearch] = useState(symbol);
  const [companyRange, setCompanyRange] = useState(range);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "relevance">("newest");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const itemsPerPage = 12;
  const newsContainerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { data: news = [], isLoading, isFetching, refetch, isPlaceholderData } = useNewsQuery(type, category, symbol, range);
  const { bookmarked, toggleBookmark } = useBookmarks();
  const { recentSearches, addSearch } = useRecentSearches();
  const processedNews = useNewsFilters(news, sortBy, filterSource);
  const { paginatedItems: paginatedNews, totalPages } = usePagination(processedNews, currentPage, itemsPerPage);

  const uniqueSources = [...new Set(news.map(item => item.source).filter(Boolean))];

  const showLoading = isLoading && !isPlaceholderData;

  const handleTabChange = (val: string) => {
    setCurrentPage(1);
    if (val === "company") {
      navigate(`/news/company?type=company&symbol=${search || "AAPL"}&range=${companyRange}`);
    } else {
      navigate(`/news/${val}?type=category&category=${val}`);
    }
    newsContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCompanySearch = () => {
    if (!search) return;
    addSearch(search);
    setCurrentPage(1);
    navigate(`/news/company?type=company&symbol=${search}&range=${companyRange}`);
  };

  const handleRangeChange = (val: string) => {
    if (search) {
      navigate(`/news/company?type=company&symbol=${search}&range=${val}`);
    }
  };

  const shareNews = (item: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.headline || item.summary,
        url: item.url,
      });
    } else {
      navigator.clipboard.writeText(item.url);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refetch();
    }, 300000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={newsContainerRef} className="w-[94%] mx-auto space-y-8 relative overflow-hidden">
      {showScrollTop && (
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      )}

      <Tabs value={type === "company" ? "company" : category} onValueChange={handleTabChange}>
        <NewsTabs />

        <TabsContent value={category} hidden={type === "company"}>
          <div className="flex sticky md:top-22 top-20 md:h-10 bg-transparent text-white h-16 z-10 justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">{category} News</h2>
            <Badge variant="secondary" className="text-sm">
              {processedNews.length} articles
            </Badge>
          </div>

          <div className="sticky md:top-34 top-[calc(100px+48px)] z-20 my-8 ">
            <NewsFilters
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterSource={filterSource}
              setFilterSource={setFilterSource}
              uniqueSources={uniqueSources}
              onRefresh={refetch}
              isRefreshing={isFetching}
              autoRefresh={autoRefresh}
              setAutoRefresh={setAutoRefresh}
            />
          </div>

          <NewsGrid
            news={paginatedNews}
            loading={showLoading}
            bookmarked={bookmarked}
            onToggleBookmark={toggleBookmark}
            onShare={shareNews}
          />
          
          <NewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollRef={newsContainerRef}
          />
        </TabsContent>

        <TabsContent value="company">
          <CompanySearch
            search={search}
            setSearch={setSearch}
            companyRange={companyRange}
            setCompanyRange={setCompanyRange}
            onSearch={handleCompanySearch}
            onRangeChange={handleRangeChange}
            recentSearches={recentSearches}
            onRecentSearchClick={(recent) => {
              setSearch(recent);
              handleCompanySearch();
            }}
          />

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📈 {symbol || "Search a Company"} News</h2>
            {symbol && (
              <Badge variant="secondary" className="text-sm">
                {processedNews.length} articles
              </Badge>
            )}
          </div>

          {symbol && (
            <NewsFilters
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterSource={filterSource}
              setFilterSource={setFilterSource}
              uniqueSources={uniqueSources}
              onRefresh={refetch}
              isRefreshing={isFetching}
              autoRefresh={autoRefresh}
              setAutoRefresh={setAutoRefresh}
            />
          )}

          <NewsGrid
            news={paginatedNews}
            loading={showLoading}
            bookmarked={bookmarked}
            onToggleBookmark={toggleBookmark}
            onShare={shareNews}
          />

          {symbol && (
            <NewsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              scrollRef={newsContainerRef}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsPage;
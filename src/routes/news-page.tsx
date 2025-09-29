import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import NewsCard, { type NewsItem } from "@/components/news-card";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronUp, 
  Clock, 
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink
} from "lucide-react";

const NewsPage = () => {
  const data = useLoaderData() as NewsItem[];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") || "category";
  const category = searchParams.get("category") || "general";
  const symbol = searchParams.get("symbol") || "";
  const range = searchParams.get("range") || "7d";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [search, setSearch] = useState(symbol);
  const [companyRange, setCompanyRange] = useState(range);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "relevance">("newest");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("newsRecentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const handleTabChange = (val: string) => {
    setLoading(true);
    setCurrentPage(1);
    if (val === "company") {
      navigate(
        `/news/company?type=company&symbol=${search || "AAPL"}&range=${companyRange}`
      );
    } else {
      navigate(`/news/${val}?type=category&category=${val}`);
    }
    
    newsContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => setLoading(false), 1000);
  };

  const handleCompanySearch = () => {
    if (!search) return;
    
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("newsRecentSearches", JSON.stringify(updated));
    setLoading(true);
    setCurrentPage(1);
    navigate(`/news/company?type=company&symbol=${search}&range=${companyRange}`);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.reload();
  };

  const toggleBookmark = (newsId: string) => {
    const newBookmarked = new Set(bookmarked);
    if (bookmarked.has(newsId)) {
      newBookmarked.delete(newsId);
    } else {
      newBookmarked.add(newsId);
    }
    setBookmarked(newBookmarked);
    localStorage.setItem("bookmarkedNews", JSON.stringify([...newBookmarked]));
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


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000); 
    return () => clearInterval(interval);
  }, [autoRefresh]);

 
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedNews");
    if (saved) {
      setBookmarked(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setNews(data);
    }
  }, [data]);


  const processedNews = useMemo(() => {
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

  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedNews.slice(startIndex, startIndex + itemsPerPage);
  }, [processedNews, currentPage]);

  const totalPages = Math.ceil(processedNews.length / itemsPerPage);
  const uniqueSources = [...new Set(news.map(item => item.source).filter(Boolean))];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSkeletons = (count: number) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );

  const renderFiltersAndActions = () => (
    <div className="md:grid md:grid-cols-3 scrollbar-hide flex overflow-auto place-items-center gap-3 mb-6 md:p-4 bg-gray-50 rounded-lg items-center">
      <div className="flex h-10 gap-2">

        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
          <SelectTrigger className="md:w-40 h-full">
            <Clock className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="relevance">Most Relevant</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="md:w-40 h-full">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map(source => (
              <SelectItem key={source} value={source!}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
       </div>
      
      <div className="flex flex-shrink-0 w-[95%] gap-2 items-center  h-9">
        <Button
          className="text-xs shadow-xs grid place-items-center rounded-sm h-full  border w-1/2"
          clicked={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>

      
        <Button
          className="text-xs shadow-xs flex items-center rounded-sm justify-center h-full border w-1/2"
          clicked={() => setAutoRefresh(!autoRefresh)}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
        </Button>
      </div>
      
     
      <div className="flex flex-shrink-0  items-center text-xs md:text-sm text-gray-600 h-10">
        Showing {paginatedNews.length} of {processedNews.length} articles
      </div>
    </div>
  );

  const renderPagination = () => (
    totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          className="bg-black text-white p-2 md:text-md text-sm"
          disabled={currentPage === 1}
          clicked={() => {
            setCurrentPage(currentPage - 1)
            newsContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Previous
        </Button>
        
        <div className="flex gap-5">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (pageNum > totalPages) return null;
            
            return (
              <Button
                key={pageNum}
                className="md:text-md text-sm"
                clicked={() => {
                  setCurrentPage(pageNum)
                  newsContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          className="text-white bg-black p-2 px-4 md:text-md text-sm"
          disabled={currentPage === totalPages}
          clicked={() => {
            setCurrentPage(currentPage + 1)
            newsContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Next
        </Button>
      </div>
    )
  );

  return (
    <div ref={newsContainerRef} className="p-6 space-y-8 relative">
      {showScrollTop && (
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
          clicked={scrollToTop}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      )}

      <Tabs value={type === "company" ? "company" : category} onValueChange={handleTabChange}>
        <TabsList className="mb-6 sticky  h-10 md:h-12 snap-x snap-mandatory scroll-smooth  z-30 md:grid gap-5 md:grid-cols-6 flex w-full overflow-x-auto scrollbar-hide justify-start lg:w-auto pl-2 lg:justify-center top-8">
          <TabsTrigger className="" value="general">📰 General</TabsTrigger>
          <TabsTrigger value="crypto">💰 Crypto</TabsTrigger>
          <TabsTrigger value="forex">💱 Forex</TabsTrigger>
          <TabsTrigger value="merger">🤝 Mergers</TabsTrigger>
          <TabsTrigger value="pressRelease">📢 Press Releases</TabsTrigger>
          <TabsTrigger value="company">📈 Company</TabsTrigger>
        </TabsList>

        <TabsContent value={category} hidden={type === "company"}>
          
          <div className="flex sticky  md:top-22 top-20 md:h-10 bg-white h-16 z-10 justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">{category} News</h2>
            <Badge variant="secondary" className="text-sm">
              {processedNews.length} articles
            </Badge>
          </div>

          <div className="sticky md:top-34 top-[calc(100px+48px)] bg-white z-20 mb-4 shadow-sm">
            {renderFiltersAndActions()}
          </div>

          {loading ? (
            renderSkeletons(6)
          ) : (
            <>
              <div  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedNews.map((item) => (
                  <div key={item.id || item.datetime} className="relative group h-full">
                    <NewsCard item={item} />
                    
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        className="h-8 w-8"
                        clicked={() => toggleBookmark(String(item.id) || String(item.datetime) || "")}
                      >
                        {bookmarked.has(String(item.id) || item.datetime?.toString() || "") ? (
                          <BookmarkCheck className="w-3 h-3" />
                        ) : (
                          <Bookmark className="w-3 h-3" />
                        )}
                      </Button>
                      
                      <Button
                        className="h-8 w-8"
                        clicked={() => shareNews(item)}
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        className="h-8 w-8"
                        clicked={() => window.open(item.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </TabsContent>

        <TabsContent value="company">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                type="search"
                name="search"
                checkInput={(e:any) => setSearch(e.target.value.toUpperCase())}
                placeholder="Enter ticker (e.g. TSLA, MSFT)"
                className="pl-10 border"
                onKeyDown={(e:any) => e.key === 'Enter' && handleCompanySearch()}
              />
              
              
              {recentSearches.length > 0 && search.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-10 max-h-40 overflow-y-auto">
                  <CardContent className="p-2">
                    <div className="text-xs text-gray-500 mb-2">Recent searches:</div>
                    {recentSearches.map((recent, idx) => (
                      <Button
                        key={idx}
                        className="w-full border-b flex gap-2 items-center h-14  text-md"
                        clicked={() => {
                          setSearch(recent);
                          handleCompanySearch();
                        }}
                      >
                        <Clock className="w-5 h-5 mr-2" />
                        {recent}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Button className="flex items-center bg-black text-white w-24 rounded-2xl justify-center" clicked={handleCompanySearch} disabled={!search}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            
            <Select
              value={companyRange}
              onValueChange={(val) => {
                setCompanyRange(val);
                if (search) {
                  navigate(`/news/company?type=company&symbol=${search}&range=${val}`);
                }
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Past Day</SelectItem>
                <SelectItem value="7d">Past 7 Days</SelectItem>
                <SelectItem value="30d">Past 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📈 {symbol || "Search a Company"} News</h2>
            {symbol && (
              <Badge variant="secondary" className="text-sm">
                {processedNews.length} articles
              </Badge>
            )}
          </div>

          {symbol && renderFiltersAndActions()}

          {loading ? (
            renderSkeletons(6)
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                {paginatedNews.map((item) => (
                  <div key={item.id || item.datetime} className="relative group">
                    <NewsCard item={item} />
                    
                    <div className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        className="h-8 w-8"
                        clicked={() => toggleBookmark(String(item.id) || item.datetime?.toString() || "")}
                      >
                        {bookmarked.has(String(item.id) || item.datetime?.toString() || "") ? (
                          <BookmarkCheck className="w-3 h-3" />
                        ) : (
                          <Bookmark className="w-3 h-3" />
                        )}
                      </Button>
                      
                      <Button
                        className="h-8 w-8"
                        clicked={() => shareNews(item)}
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        className="h-8 w-8"
                        clicked={() => window.open(item.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {symbol && renderPagination()}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsPage;
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Share2, ExternalLink } from "lucide-react";
import NewsCard, { type NewsItem } from "@/components/features/news/components/news-card";
import type { BookmarkedNews } from "../hook/useBookmarks";

interface NewsGridProps {
  news: NewsItem[];
  loading: boolean;

 
  bookmarked: Record<string, BookmarkedNews>;

  onToggleBookmark: (item: BookmarkedNews) => void;

  onShare: (item: NewsItem) => void;
}

export const NewsGrid = ({
  news,
  loading,
  bookmarked,
  onToggleBookmark,
  onShare,
}: NewsGridProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => {
        const itemId = String(item.id ?? item.datetime ?? "");

        const bookmarkItem: BookmarkedNews = {
          id: itemId,
          title: item.headline,
          description: item.summary,
          url: item.url,
          img_src:item.image,
          source: item.source,
          publishedAt: (item.datetime).toString(),
        };

        const isBookmarked = Boolean(bookmarked[itemId]);

        return (
          <div key={itemId} className="relative group flex flex-col h-full">
            <NewsCard item={item} />

            <div className="absolute bottom-6 right-5 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                className="h-8 w-8"
                onClick={() => onToggleBookmark(bookmarkItem)}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-3 h-3" />
                ) : (
                  <Bookmark className="w-3 h-3" />
                )}
              </Button>

              <Button
                className="h-8 w-8"
                onClick={() => onShare(item)}
              >
                <Share2 className="w-3 h-3" />
              </Button>

              <Button
                className="h-8 w-8"
                onClick={() => window.open(item.url, "_blank")}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import { useState, useEffect } from "react";

export interface BookmarkedNews {
  id: string;
  title: string;
  description?: string;
  url?: string;
  source?: string;
  img_src:string | null
  publishedAt?: string;
}

export const useBookmarks = () => {
  const [bookmarked, setBookmarked] = useState<Record<string, BookmarkedNews>>({});


  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedNews");
    if (saved) {
      try {
        const parsed: Record<string, BookmarkedNews> = JSON.parse(saved);
        setBookmarked(parsed);
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);


  const toggleBookmark = (item: BookmarkedNews) => {
    setBookmarked(prev => {
      const next = { ...prev };

      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }

      localStorage.setItem("bookmarkedNews", JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (id: string) => Boolean(bookmarked[id]);
  const bookmarksArray = Object.values(bookmarked);

  return {
    bookmarked,        // Record<string, BookmarkedNews>
    bookmarksArray,    // BookmarkedNews[]
    toggleBookmark,    // (item) => void
    isBookmarked,      // (id) => boolean
  };
};

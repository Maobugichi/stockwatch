import { useState } from "react";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("newsRecentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const addSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("newsRecentSearches", JSON.stringify(updated));
  };

  return { recentSearches, addSearch };
};
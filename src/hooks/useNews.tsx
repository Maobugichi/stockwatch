import { useQuery } from "@tanstack/react-query";
import { fetchTrendingNews } from "@/lib/utils";

const useNews = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['trending-news'],
    queryFn: fetchTrendingNews,
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000, 
    retry: 2,
    refetchOnWindowFocus: false, 
    refetchOnMount: false, 
  });

  return { 
    news: data || [], 
    loading: isLoading,
    isError,
    error,
    refetch
  };
};

export default useNews;
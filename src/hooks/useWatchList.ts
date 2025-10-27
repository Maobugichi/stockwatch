import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/authContext";
import { toast } from "sonner";
import api from "@/lib/axios-config";


type WatchlistItem = {
  id?: number;
  ticker: string;
  userId?: number;
  addedAt?: string;
};

interface Stock {
     symbol: string;
     company_name: string;
     current_price: number | null;
     change_percent_daily: number | null;
     market_cap: number | null;
     pe_ratio: number | null;
     volume: number | null;
     fifty_two_week_high: number | null;
     fifty_two_week_low: number | null;
     sparkline: {
      timestamps: string[];
      closes: number[];
    };
}


export function useWatchlist() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<Stock[]>({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.get(`/api/getList`);

      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (ticker: string) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.post(`/api/watchlist/add/${userId}`, { ticker });

      return response.data;
    },

    
    onMutate: async (ticker) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist", userId] });

      const previousWatchlist = queryClient.getQueryData(["watchlist", userId]);

      
      queryClient.setQueryData(["watchlist", userId], (old: Stock[] = []) => {
        // Check if already exists
        if (old.some(item => item.symbol === ticker)) {
          return old;
        }

        return [
          ...old,
          {
            ticker,
            userId,
            addedAt: new Date().toISOString(),
          }
        ];
      });

      return { previousWatchlist };
    },

    onError: (err, ticker, context) => {
       console.log(ticker)
      if (context?.previousWatchlist) {
        queryClient.setQueryData(["watchlist", userId], context.previousWatchlist);
      }

      toast.error("Failed to add to watchlist", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },

    onSuccess: (data, ticker) => {
        console.log(data)
      toast.success("Added to watchlist!", {
        description: `${ticker} is now in your watchlist`,
      });

      // Refetch to get accurate data
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
    },
  });
}


export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (ticker: string) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.delete(`/api/watchlist/remove/${userId}/${ticker}`);

      return response.data;
    },

    onMutate: async (ticker) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist", userId] });

      const previousWatchlist = queryClient.getQueryData(["watchlist", userId]);

      // Optimistically remove from cache
      queryClient.setQueryData(["watchlist", userId], (old: WatchlistItem[] = []) => {
        return old.filter(item => item.ticker !== ticker);
      });

      return { previousWatchlist };
    },

    onError: (err, ticker, context) => {
        console.log(ticker)
      if (context?.previousWatchlist) {
        queryClient.setQueryData(["watchlist", userId], context.previousWatchlist);
      }

      toast.error("Failed to remove from watchlist", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },

    onSuccess: (data, ticker) => {
        console.log(data)
      toast.success("Removed from watchlist", {
        description: `${ticker} removed successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
    },
  });
}


export function useIsInWatchlist(ticker: string) {
  const { data: watchlist = [] } = useWatchlist();
  return watchlist.some(item => item.symbol === ticker);
}


export function useToggleWatchlist() {
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return {
    toggle: async (ticker: string) => {
      const watchlist = queryClient.getQueryData<WatchlistItem[]>(["watchlist", user?.id]) || [];
      const isInWatchlist = watchlist.some(item => item.ticker === ticker);

      if (isInWatchlist) {
        await removeFromWatchlist.mutateAsync(ticker);
      } else {
        await addToWatchlist.mutateAsync(ticker);
      }
    },
    isPending: addToWatchlist.isPending || removeFromWatchlist.isPending,
  };
}
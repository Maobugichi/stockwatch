import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/authContext";
import { toast } from "sonner";
import api from "@/lib/axios-config";

// Types
export interface PortfolioHolding {
  ticker: string;
  shares: string | number;
  buyPrice: string | number;
}

export interface PortfolioBreakdownItem {
  symbol: string;
  shares: string | number;
  buyPrice: string | number;
  currentPrice: number;
  prevClose: number;
  marketCap: number;
  peRatio: number | null;
  dividendYield: number | null;
  valid: boolean;
}

export interface DashboardData {
  portfolioValue: number;
  investedAmount: number;
  profitLoss: number;
  percentGainLoss: number;
  dailyChange: number;
  dailyChangePercent: number;
  avgPE: number;
  averageDividendYield: number;
  totalMarketCap: number;
  breakdown: PortfolioBreakdownItem[];
  topStock?: {
    symbol: string;
    gainLoss: number;
    pct: number;
  };
  worstStock?: {
    symbol: string;
    gainLoss: number;
    pct: number;
  };
  meta?: {
    totalHoldings: number;
    validHoldings: number;
    invalidHoldings: number;
  };
}


export function useAddPortfolioHolding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (holding: PortfolioHolding) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.post(`/api/save-port/${userId}`, holding);

     
      try {
        await api.delete(`/api/portfolio/${userId}/cache`);
      } catch (err) {
        console.warn("Cache clear failed:", err);
      }

      return response.data;
    },

    onMutate: async (newHolding) => {
   
      await queryClient.cancelQueries({ queryKey: ["dashboard", userId] });

      // Snapshot previous value
      const previousDashboard = queryClient.getQueryData<DashboardData>([
        "dashboard",
        userId,
      ]);

      // Optimistically update
      queryClient.setQueryData<DashboardData>(
        ["dashboard", userId],
        (old) => {
          if (!old) return old;

          const shares = Number(newHolding.shares);
          const buyPrice = Number(newHolding.buyPrice);

          const newBreakdownItem: PortfolioBreakdownItem = {
            symbol: newHolding.ticker,
            shares: newHolding.shares,
            buyPrice: newHolding.buyPrice,
            currentPrice: buyPrice,
            prevClose: buyPrice,
            marketCap: 0,
            peRatio: null,
            dividendYield: null,
            valid: true,
          };

          return {
            ...old,
            breakdown: [...(old.breakdown || []), newBreakdownItem],
            investedAmount: old.investedAmount + shares * buyPrice,
            meta: old.meta
              ? {
                  ...old.meta,
                  totalHoldings: old.meta.totalHoldings + 1,
                }
              : undefined,
          };
        }
      );

      return { previousDashboard };
    },

    onError: (err, newHolding, context) => {
      // Rollback on error
      if (context?.previousDashboard) {
        queryClient.setQueryData(
          ["dashboard", userId],
          context.previousDashboard
        );
      }

      toast.error("Failed to add holding", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },

    onSuccess: (data, variables) => {
      toast.success("Holding added successfully!", {
        description: `${variables.ticker} added to your portfolio`,
      });

      // Refetch for accurate server data
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });
}

// Delete Portfolio Holding Hook
export function useDeletePortfolioHolding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (holdingId: number) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.delete(
        `/api/portfolio/${userId}/holdings/${holdingId}`
      );

      // Clear cache
      try {
        await api.delete(`/api/portfolio/${userId}/cache`);
      } catch (err) {
        console.warn("Cache clear failed:", err);
      }

      return response.data;
    },

    onMutate: async (holdingId) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard", userId] });

      const previousDashboard = queryClient.getQueryData<DashboardData>([
        "dashboard",
        userId,
      ]);

      // Optimistically remove holding
      queryClient.setQueryData<DashboardData>(
        ["dashboard", userId],
        (old) => {
          if (!old) return old;

          const filteredBreakdown = old.breakdown.filter(
            (item, index) => index !== holdingId
          );

          return {
            ...old,
            breakdown: filteredBreakdown,
            meta: old.meta
              ? {
                  ...old.meta,
                  totalHoldings: filteredBreakdown.length,
                }
              : undefined,
          };
        }
      );

      return { previousDashboard };
    },

    onError: (err, holdingId, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(
          ["dashboard", userId],
          context.previousDashboard
        );
      }

      toast.error("Failed to delete holding", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },

    onSuccess: () => {
      toast.success("Holding deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });
}


export function useUpdatePortfolioHolding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({
      holdingId,
      data,
    }: {
      holdingId: number;
      data: Partial<PortfolioHolding>;
    }) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.patch(
        `/api/portfolio/${userId}/holdings/${holdingId}`,
        data
      );

      // Clear cache
      try {
        await api.delete(`/api/portfolio/${userId}/cache`);
      } catch (err) {
        console.warn("Cache clear failed:", err);
      }

      return response.data;
    },

    onMutate: async ({ holdingId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard", userId] });

      const previousDashboard = queryClient.getQueryData<DashboardData>([
        "dashboard",
        userId,
      ]);

      // Optimistically update
      queryClient.setQueryData<DashboardData>(
        ["dashboard", userId],
        (old) => {
          if (!old) return old;

          const updatedBreakdown = old.breakdown.map((item, index) => {
            if (index === holdingId) {
              return {
                ...item,
                ...(data.ticker && { symbol: data.ticker }),
                ...(data.shares && { shares: data.shares }),
                ...(data.buyPrice && { buyPrice: data.buyPrice }),
              };
            }
            return item;
          });

          return {
            ...old,
            breakdown: updatedBreakdown,
          };
        }
      );

      return { previousDashboard };
    },

    onError: (err, variables, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(
          ["dashboard", userId],
          context.previousDashboard
        );
      }

      toast.error("Failed to update holding", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },

    onSuccess: () => {
      toast.success("Holding updated successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });
}
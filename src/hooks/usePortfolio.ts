import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/authContext";
import { toast } from "sonner"; 

import api from "@/lib/axios-config";

type UserChoiceType = {
  ticker: string;
  shares: string;
  buyPrice: string;
};

export function useAddPortfolioHolding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (userChoice: UserChoiceType) => {
      if (!userId) throw new Error("User not authenticated");
      const response = await api.post(`/api/save-port/${userId}`, userChoice);
      return response.data;
    },
    
  
    onMutate: async (newHolding) => {
     
      await queryClient.cancelQueries({ queryKey: ["dashboard", userId] });

      const previousDashboard = queryClient.getQueryData(["dashboard", userId]);

   
      queryClient.setQueryData(["dashboard", userId], (old: any) => {
        if (!old) return old;

        const newBreakdownItem = {
          symbol: newHolding.ticker,
          shares: Number(newHolding.shares),
          buyPrice: Number(newHolding.buyPrice),
          currentPrice: Number(newHolding.buyPrice), 
          pl: 0, 
        };

        return {
          ...old,
          breakdown: [...(old.breakdown || []), newBreakdownItem],
          totalInvested: old.totalInvested + (Number(newHolding.shares) * Number(newHolding.buyPrice)),
        };
      });

      return { previousDashboard };
    },

    // On error, rollback to previous state
    onError: (err, newHolding, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard", userId], context.previousDashboard);
      }
      
      toast.error("Failed to add holding", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },

    // Refetch to get accurate data from server
    onSuccess: (data) => {
      toast.success("Holding added successfully!", {
        description: `Added ${data.symbol || "stock"} to your portfolio`,
      });

     
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });
}
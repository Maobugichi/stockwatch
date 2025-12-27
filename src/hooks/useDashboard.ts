import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { useAuth } from "./authContext";



export function useDashboard() {
  const { user:userData } = useAuth();
  const userId = userData?.id;

  return useQuery({
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await api.get(`/api/portfolio/`,{
        headers: { "x-requires-auth": true }
      });
       console.log(response.data)
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 2,
  });
}

export function useDashboardData() {
  const queryClient = useQueryClient();
    const { user:userData } = useAuth();
  const userId = userData?.id;
  
  return queryClient.getQueryData(["dashboard", userId]);
}


export function usePrefetchDashboard() {
  const queryClient = useQueryClient();
  const { user:userData } = useAuth();
  const userId = userData?.id;

  return () => {
    if (userId) {
      queryClient.prefetchQuery({
        queryKey: ["dashboard", userId],
        queryFn: async () => {
          const response = await api.get(`/api/portfolio/`,{
       
      });
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };
}
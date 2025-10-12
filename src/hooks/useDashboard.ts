import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios-config";

export function useDashboard() {
  const userData = localStorage.getItem("user-data");
  const userId = userData ? JSON.parse(userData).userId : null;

  console.log(userId)

  return useQuery({
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      const response = await api.get(`/api/portfolio/${userId}`);
      
    
      localStorage.setItem("dashInfo", JSON.stringify(response.data));
      
      return response.data;
    },
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
}

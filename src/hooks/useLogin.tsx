import { useMutation } from "@tanstack/react-query";
import type { UserDetails } from "@/types";
import axios from "axios";

import { toast } from "sonner";

const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

async function loginUser(userData: UserDetails) {
  try {
    const { email, password } = userData;
    if (!email || !password) return;
    const response = await axios.post(`${backendEndpoint}/login/`, { email, password }, {
      withCredentials: true,
    });

    
    return { ...response.data };
  } catch (err) {
    console.log(err)
    throw err; // Important: re-throw so onError is triggered
  }
}

export function useLogin() {
  //const navigate = useNavigate();
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      //console.log('🔍 Login Success Data:', data);
      console.log('🔍 Current URL:', window.location.href);
      console.log('🔍 Current Hash:', window.location.hash);
      console.log('🔍 Origin:', window.location.origin);
      console.log('🔍 Pathname:', window.location.pathname);
      


      if (!data) {
        toast.error("Login Failed", {
          description: "No response data received"
        });
        return;
      }
     
      
      toast.success("Login Success", {
        description: "Welcome back champ"
      });
      
      // Force full page navigation with the complete URL
      const baseUrl = window.location.origin + window.location.pathname;
      const targetHash = data.onboarded ? '#/' : '#/onboarding';
      const fullUrl = baseUrl + targetHash;
      
      console.log('🔍 Navigating to full URL:', fullUrl);
      
      // Use a small delay to ensure toast shows, then force navigation
      setTimeout(() => {
        window.location.href = fullUrl;
      }, 300);
    },
    onError: (error) => {
      console.error('❌ Login Error:', error);
      let message = "An unexpected error occurred.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.";
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      toast.error("Login Failed", {
        description: message
      });
    }
  })
}
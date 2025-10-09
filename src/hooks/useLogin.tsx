import { useMutation } from "@tanstack/react-query";
import type { UserDetails } from "@/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

async function loginUser(userData: UserDetails) {
  try {
    const { email, password } = userData;
    if (!email || !password) return;
    const response = await axios.post(`${backendEndpoint}/login/`, { email, password }, {
      withCredentials: true,
    })
    return { ...response.data };
  } catch (err) {
    console.log(err)
    throw err; 
  }
}

export function useLogin() {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('🔍 Login Success Data:', data);
      console.log('🔍 Current URL:', window.location.href);
      console.log('🔍 Current Hash:', window.location.hash);
      
      if (!data) {
        toast.error("Login Failed", {
          description: "No response data received"
        });
        return;
      }
      
      toast.success("Login Success", {
        description: "Welcome back champ"
      });
      
      const targetPath = data.onboarded ? '/' : '/onboarding/';
      console.log('🔍 Attempting to navigate to:', targetPath);
      
      // Force navigation with window.location as fallback
      try {
        //navigate(targetPath, { replace: true });
        console.log('✅ Navigate called successfully');
        
        // Fallback: If navigation doesn't work, force reload to target
        setTimeout(() => {
          const currentPath = window.location.hash.replace('#', '');
          console.log('🔍 After navigate, current path:', currentPath);
          
          if (currentPath !== targetPath) {
            console.warn('⚠️ Navigation failed, forcing with location.hash');
            //window.location.hash = targetPath;
            //window.location.reload();
          }
        }, 100);
        
      } catch (err) {
        console.error('❌ Navigation error:', err);
        // Force fallback
        //window.location.hash = targetPath;
        //window.location.reload();
      }
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
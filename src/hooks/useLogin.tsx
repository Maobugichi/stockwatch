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
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Just show the toast, don't navigate here
      toast.success("Login Success", {
        description: "Welcome back champ"
      });
      
      // Return the data so the component can access it
      return data;
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
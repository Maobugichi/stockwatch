import { useMutation } from "@tanstack/react-query";
import type { UserDetails } from "@/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




const backendEndpoint = import.meta.env.VITE_API_BASE_URL;
const basePath = import.meta.env.VITE_BASE_URL || '/stockwatch/';

async function loginUser(userData:UserDetails) {
  try {
    const { email , password } = userData;
    if (!email || !password) return;
    const response = await axios.post(`${backendEndpoint}/login/`,{ email , password },{
      withCredentials:true,
    })
    return { ...response.data };
  } catch(err) {
    console.log(err)
  }
}


export function useLogin() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn:loginUser,
        onSuccess: (data) => {
            
            if (!data) {
                toast.error("Login Failed", {
                description: "No response data received"
                });
                return;
            }
            toast.success("Login Success", {
                description: "Welcome back champ"
            });
             console.log(data)
                if (data.onboarded) {
                navigate(`${basePath}`, { replace: true });
                
                } else {
                navigate('/onboarding/', { replace: true });
                }
        } ,
        onError: (error) => {
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
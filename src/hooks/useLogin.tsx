import { useMutation } from "@tanstack/react-query";
import type { UserDetails } from "@/types";
import axios from "axios";
import { redirect } from "react-router-dom";

const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

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
    return useMutation({
        mutationFn:loginUser,
        onSuccess: (data) => {
            console.log(data)
            redirect('/')
        }
    })
}
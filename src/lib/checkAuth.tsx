
import { redirect } from "react-router-dom";
import api from "./axios-config";



export async function authLoader() {
  try {
    const response = await api.get(`/`);

    if (response.data) {
        
         redirect("/portfolio/");
    } 
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw redirect("/login/");
    }
    throw err; 
  }
}


export function logout() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/login";
}
import axios from "axios";
import { redirect } from "react-router-dom";


const backendEndpoint = import.meta.env.VITE_API_BASE_URL;



export async function authLoader() {
  try {
    const response = await axios.get(`${backendEndpoint}/`, { withCredentials: true });

    if (response.data) {
        console.log(response.data)
        redirect('/')
    } 
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw redirect("/login");
    }
    throw err; // let React Router handle other errors
  }
}


export function logout() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/login";
}
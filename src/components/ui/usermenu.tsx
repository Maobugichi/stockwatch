import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/authContext"
import { useNavigate } from "react-router-dom"
import api from "@/lib/axios-config"

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post(
        `/api/logout`
      )
      logout() 
      navigate("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer text-black">
          <AvatarFallback>
            {user?.email?.slice(0, 2).toUpperCase() || "US"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

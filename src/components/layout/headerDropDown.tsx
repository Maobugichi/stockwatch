import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, PlusCircle, Bookmark, MoreVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import type { SetStateAction } from "react";
import type { BookmarkedNews } from "../features/news/hook/useBookmarks";


interface HeaderDropDownProps {
    setOpen:React.Dispatch<SetStateAction<boolean>>;
    setOpenWatch:React.Dispatch<SetStateAction<boolean>>;
    setOpenBookmarks:React.Dispatch<SetStateAction<boolean>>;
    bookmarked:Record<string, BookmarkedNews>
}

export const HeaderDropDown = ({setOpen, setOpenWatch, setOpenBookmarks, bookmarked}:HeaderDropDownProps) => {
    return(
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
            >
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault(); 
              setOpen(true);
            }}
            className="cursor-pointer"
          >
            <PlusCircle size={16} className="mr-2" />
            <span>Add to Portfolio</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              setOpenWatch(true);
            }}
            className="cursor-pointer"
          >
            <Eye size={16} className="mr-2" />
            <span>Add to Watchlist</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onSelect={() => setOpenBookmarks(true)}
            className="cursor-pointer"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Bookmarked News</span>
            {Object.values(bookmarked).length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {Object.values(bookmarked).length}
              </Badge>
            )}
          </DropdownMenuItem>

           <DropdownMenuSeparator />
    
          <DropdownMenuItem asChild>
            <div className="cursor-pointer">
             
            </div>
          </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
    )
}
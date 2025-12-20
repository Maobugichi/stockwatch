import { useState, useEffect } from "react";
import Holdings from "../holdings";
import CreateAlertForm from "./alert-form";
import { Bookmark, Search, X } from "lucide-react";
import type { UserChoiceType, UserChoiceTypeWatch } from "@/types";
import { StockWatcherLogo } from "../logo";
import { UserMenu } from "./usermenu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/utils";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { BookmarkedNews } from "../features/news/hook/useBookmarks";
import { HeaderDropDown } from "../layout/headerDropDown";
import { Button } from "./button";

interface HeaderProp {
  style?: any;
  isOpen:boolean
}


const Header: React.FC<HeaderProp> = ({ style , isOpen }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<UserChoiceType>({
    ticker: "",
    shares: "",
    buyPrice: ""
  });


  const [openWatch, setOpenWatch] = useState<boolean>(false);
  const [userChoiceWatch, setUserChoiceWatch] = useState<UserChoiceTypeWatch>({
    ticker: ""
  });

  const [openBookmarks, setOpenBookmarks] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<Record<string, BookmarkedNews>>({});

  const [searchQuery, setSearchQuery] = useState<string>("");

 
  useEffect(() => {
  const stored = localStorage.getItem("bookmarkedNews");
 
  if (stored) {
    try {
      setBookmarked(JSON.parse(stored));
    } catch (error) {
      console.error("Error parsing bookmarks:", error);
    }
  }
}, [openBookmarks]);


  const removeBookmark = (id: string) => {
    setBookmarked(prev => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem("bookmarkedNews", JSON.stringify(next));
      return next;
    });
  };


  const filteredBookmarks = Object.values(bookmarked).filter(item => (
       item?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item?.description?.toLowerCase().includes(searchQuery.toLowerCase())   
  ));

  

  return (
    <motion.header
      style={style}
      initial={{ width: "100%" }}
     
      transition={{ duration: 0.3, type: "spring", stiffness: 20 }}
      className="fixed top-0 z-50 h-14 md:h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 md:w-[95.5%] w-full right-0"
    >
      <div className="container mx-auto h-full px-3 md:px-4 flex items-center justify-between gap-3">
       
        <StockWatcherLogo />

        <div className="flex items-center gap-2 md:gap-3">
         
         <HeaderDropDown setOpen={setOpen} setOpenWatch={setOpenWatch} setOpenBookmarks={setOpenBookmarks} bookmarked={bookmarked}/>

          <Holdings
            header={<></>} 
            type="portfolio"
            open={open}
            setOpen={setOpen}
            userChoice={userChoice}
            setUserChoice={setUserChoice}
            buttonClass="hidden" 
          />

          <Holdings
            type="watchlist"
            header={<></>}
            open={openWatch}
            setOpen={setOpenWatch}
            userChoice={userChoiceWatch}
            setUserChoice={setUserChoiceWatch}
            buttonClass="hidden"
          />
           <CreateAlertForm />
         
          <div className="h-6 md:h-8 w-px bg-white/10" />

          <UserMenu />
        </div>
      </div>

     

    
      <Sheet open={openBookmarks} onOpenChange={setOpenBookmarks}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="flex items-center  py-8 gap-2 text-lg">
              <Bookmark size={20} />
              Bookmarks
              {Object.values(bookmarked).length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {Object.values(bookmarked).length}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Your bookmarked news articles
            </SheetDescription>
            
           
            {Object.values(bookmarked).length > 0 && (
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {Object.values(bookmarked).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <Bookmark size={32} className="text-slate-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No bookmarks yet</h3>
                <p className="text-sm text-slate-600 max-w-[250px]">
                  Save articles you want to read later by clicking the bookmark icon
                </p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No results found</h3>
                <p className="text-sm text-slate-600">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookmarks.map((item) => (
                  <Card key={item.id} className="relative pt-12 group px-2 hover:shadow-md transition-shadow rounded-3xl">
                    <CardContent className="w-[90%] mx-auto px-0">
                      <Button className=" absolute right-3 top-2 bg-transparent" onClick={() => removeBookmark(item.id)}>
                        <X size={50} color="black"/>
                      </Button>
                      <div className="flex w-full gap-3">
                        <div className="space-y-4">
                         {item.img_src && <img className="rounded-2xl w-full" src={item.img_src} alt={item.title} />}

                          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                            {item.source && (
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                {item.source}
                              </Badge>
                            )}
                            {item.publishedAt && (
                              <span className="text-slate-400">
                                {formatDate(item.publishedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                       
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read full article →
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
};

export default Header;
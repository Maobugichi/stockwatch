import Holdings from "../holdings"
import { useState, useEffect } from "react";
import CreateAlertForm from "./alert-form";
import { Eye, PlusCircle, Bookmark, X } from "lucide-react";
import type { UserChoiceType, UserChoiceTypeWatch } from "@/types";
import { StockWatcherLogo } from "../logo";
import { UserMenu } from "./usermenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";

interface HeaderProp {
  style: any;
}

interface BookmarkedNews {
  id: string;
  title: string;
  url?: string;
  source?: string;
  publishedAt?: string;
  description?: string;
}

const Header: React.FC<HeaderProp> = ({ style }) => {
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
  const [bookmarked, setBookmarked] = useState<BookmarkedNews[]>([]);

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
    const newBookmarked = bookmarked.filter(item => item.id !== id);
    setBookmarked(newBookmarked);
    localStorage.setItem("bookmarkedNews", JSON.stringify(newBookmarked));
  };

  return (
    <header
      style={style}
      className="fixed top-0 z-50 h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 md:w-[95.5%] w-full right-0"
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <StockWatcherLogo />

        <div className="flex items-center gap-2 md:gap-3">
          <Holdings
            header={<PlusCircle size={20} />}
            type="portfolio"
            open={open}
            setOpen={setOpen}
            userChoice={userChoice}
            setUserChoice={setUserChoice}
          />

          <CreateAlertForm />

          <Holdings
            type="watchlist"
            header={<Eye size={20} />}
            open={openWatch}
            setOpen={setOpenWatch}
            userChoice={userChoiceWatch}
            setUserChoice={setUserChoiceWatch}
          />

          {/* Bookmarks Sheet */}
          <Sheet open={openBookmarks} onOpenChange={setOpenBookmarks}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/10"
              >
                <Bookmark size={20} />
                {bookmarked.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {bookmarked.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Bookmark size={20} />
                  Bookmarked News
                </SheetTitle>
                <SheetDescription>
                  {bookmarked.length === 0
                    ? "You haven't bookmarked any news articles yet"
                    : `${bookmarked.length} bookmarked ${bookmarked.length === 1 ? "article" : "articles"}`}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {bookmarked.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Bookmark size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      Bookmark articles to read them later
                    </p>
                  </div>
                ) : (
                  bookmarked.map((item) => (
                    <Card key={item.id} className="group">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-sm leading-tight">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {item.source && <span>{item.source}</span>}
                              {item.publishedAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {new Date(item.publishedAt).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:text-blue-700 inline-block"
                              >
                                Read article →
                              </a>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeBookmark(item.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Divider */}
          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
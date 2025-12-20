import { useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { TrendingUp,  } from "lucide-react";
import { useDebouncedTickerSearch } from "@/hooks/useTickerSearch";
import { useStockDashboard } from "@/components/features/dashboard/hooks/useStockDashboardContext";
import { SearchResult } from "../../features/dashboard/search/searchResult";
import { NoResult } from "@/components/features/dashboard/search/NoResult";
import { Searching } from "@/components/features/dashboard/search/Searching";
import { SearchInput } from "@/components/features/dashboard/search/SearchInput";



export default function ModernTickerSearch() {
  const { searchTerm  } = useStockDashboard();
 
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: options = [], isLoading: loading } = useDebouncedTickerSearch(searchTerm);
   
  const shouldShowPopover = searchTerm.length > 0 || loading;



  return (
    <div className="flex  w-[90%] items-center">
      <Popover open={shouldShowPopover}>
        <PopoverTrigger asChild>
           <SearchInput ref={inputRef} loading={loading}/>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width]  block p-0 border-0 shadow-xl rounded-xl overflow-hidden"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {loading && (
           <Searching/>
          )}

          {!loading && searchTerm && options.length === 0 && (
            <NoResult/>
          )}

          {!loading && options.length > 0 && (
            <div className="max-h-[320px] overflow-auto ">
              <div className="sticky top-0 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-b flex items-center justify-between z-10">
                <span>Found {options.length} result{options.length !== 1 ? 's' : ''}</span>
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
              </div>
              {options.map((item: any) => <SearchResult item={item}/>)}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
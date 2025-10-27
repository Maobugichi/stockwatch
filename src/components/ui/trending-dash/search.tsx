import { useRef, type SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search, X, RefreshCw, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { useDebouncedTickerSearch } from "@/hooks/useTickerSearch";



export default function ModernTickerSearch({ onSelect , searchTerm , setSearchTerm , setUserChoice  }: { onSelect?: (item: any) => void  , searchTerm:string , setSearchTerm:React.Dispatch<SetStateAction<string>> , setUserChoice:any}) {
  
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: options = [], isLoading: loading } = useDebouncedTickerSearch(searchTerm);

 
  const shouldShowPopover = searchTerm.length > 0 || loading;

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleSelect = (item: any) => {
    setSearchTerm("");
    setUserChoice(item)
    onSelect?.(item);
  };

  return (
    <div className="flex items-center">
      <Popover open={shouldShowPopover}>
        <PopoverTrigger asChild>
          <div className="relative w-full group">
            <Input
              ref={inputRef}
              placeholder="Search ticker (AAPL, TSLA, MSFT...)"
              value={searchTerm}
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="search"
              className="relative pr-20 h-11 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all duration-200 shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              {searchTerm && (
                <button
                  className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={handleClear}
                  type="button"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 border-0 shadow-xl rounded-xl overflow-hidden"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {loading && (
            <div className="p-6 text-center">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-blue-500" />
              <p className="text-sm text-gray-600 font-medium">Searching markets...</p>
            </div>
          )}

          {!loading && searchTerm && options.length === 0 && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
              <p className="text-xs text-gray-500">Try searching for "{searchTerm}" again</p>
            </div>
          )}

          {!loading && options.length > 0 && (
            <div className="max-h-[320px] overflow-auto">
              <div className="sticky top-0 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-b flex items-center justify-between z-10">
                <span>Found {options.length} result{options.length !== 1 ? 's' : ''}</span>
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
              </div>
              {options.map((item: any) => (
                <div
                  key={item.symbol}
                  className="group relative flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b last:border-b-0 transition-all duration-200"
                  onClick={() => handleSelect(item)}
                >
                  {/* Subtle left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-black to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {item.symbol}
                        {item.exchange && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                            {item.exchange}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 truncate mt-0.5">
                        {item.name}
                      </div>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
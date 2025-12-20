import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, X } from "lucide-react";
import { useStockDashboard } from "../hooks/useStockDashboardContext";

interface SearchInputProps {
  loading: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ loading }, ref) => {
    const { searchTerm, setSearchTerm, handleClear } = useStockDashboard();

    return (
      <div className="relative w-full group">
        <Input
          ref={ref}
          placeholder="Search ticker (AAPL, TSLA, MSFT...)"
          value={searchTerm}
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          name="search"
          className="shadow-none rounded-3xl relative pr-20 h-11 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100  transition-all duration-200 "
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {searchTerm && (
            <button
              className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-lg"
              onClick={() => handleClear(ref)}
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
    );
  }
);

SearchInput.displayName = "SearchInput";

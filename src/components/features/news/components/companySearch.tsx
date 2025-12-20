import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock } from "lucide-react";

interface CompanySearchProps {
  search: string;
  setSearch: (value: string) => void;
  companyRange: string;
  setCompanyRange: (value: string) => void;
  onSearch: () => void;
  onRangeChange: (range: string) => void;
  recentSearches: string[];
  onRecentSearchClick: (search: string) => void;
}

export const CompanySearch = ({
  search,
  setSearch,
  companyRange,
  setCompanyRange,
  onSearch,
  onRangeChange,
  recentSearches,
  onRecentSearchClick,
}: CompanySearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          type="search"
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          placeholder="Enter ticker (e.g. TSLA, MSFT)"
          className="pl-10 border"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        
        {recentSearches.length > 0 && search.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-10 max-h-40 overflow-y-auto">
            <CardContent className="p-2">
              <div className="text-xs text-gray-500 mb-2">Recent searches:</div>
              {recentSearches.map((recent, idx) => (
                <Button
                  key={idx}
                  className="w-full border-b flex gap-2 items-center h-14 text-md"
                  onClick={() => onRecentSearchClick(recent)}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  {recent}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      
      <Button 
        className="flex items-center bg-black text-white w-24 rounded-2xl justify-center" 
        onClick={onSearch} 
        disabled={!search}
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
      
      <Select
        value={companyRange}
        onValueChange={(val) => {
          setCompanyRange(val);
          onRangeChange(val);
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1d">Past Day</SelectItem>
          <SelectItem value="7d">Past 7 Days</SelectItem>
          <SelectItem value="30d">Past 30 Days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
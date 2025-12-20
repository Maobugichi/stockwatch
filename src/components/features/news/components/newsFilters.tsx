import { Clock, Filter, RefreshCw, Check } from "lucide-react";
import FilterSelect from "./filterActions/filterSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsFiltersProps {
  sortBy: "newest" | "oldest" | "relevance";
  setSortBy: (value: "newest" | "oldest" | "relevance") => void;
  filterSource: string;
  setFilterSource: (value: string) => void;
  uniqueSources: (string | undefined)[];
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
}

export const NewsFilters = ({
  sortBy,
  setSortBy,
  filterSource,
  setFilterSource,
  uniqueSources,
  onRefresh,
  isRefreshing,
  autoRefresh,
  setAutoRefresh,
}: NewsFiltersProps) => {
  const activeFiltersCount = (filterSource !== "all" ? 1 : 0);
  
  return (
    <div className="flex flex-col rounded-2xl md:flex-row py-5 px-5 shadow-none md:flex-wrap items-center justify-between gap-2 w-full  bg-muted/30  border">
   
      <div className="flex flex-row flex-wrap    items-center  md:w-fit w-full gap-3 md:gap-2">
          <FilterSelect
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort"
            icon={ <Clock className="w-4 h-4 text-muted-foreground" />}
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "relevance", label: "Relevant" },
            ]}
          />
      

        <div className="hidden flex-0 sm:block h-6 w-px bg-border" />

          <FilterSelect
            value={filterSource}
            onChange={setFilterSource}
            placeholder="Source"
            icon={ <Filter className="w-4 h-4 text-muted-foreground" />}
            options={[
              { value: "all", label: "All Sources" },
              ...uniqueSources.map((source: any) => ({
                value: source!,
                label: source!,
              })),
            ]}
          />
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
      
      </div>

     
      <div className="flex items-center md:w-fit w-full gap-3 md:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 flex-1 rounded-3xl"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="md:hidden inline">Refresh</span>
        </Button>

        <Button
          variant={autoRefresh ? "default" : "outline"}
          size="sm"
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="gap-1.5 min-w-[90px] rounded-3xl flex-1"
        >
          {autoRefresh && <Check className="w-4 h-4" />}
          <span>Auto {autoRefresh ? "ON" : "OFF"}</span>
        </Button>
      </div>
    </div>
  );
};
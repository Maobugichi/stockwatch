import { Eye, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Globe } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";


const TabsListComponent = () => {
 
  return (
    <TabsList className="w-full overflow-x-auto scrollbar-hide flex justify-start lg:w-auto pl-2 lg:justify-center">
            <TabsTrigger value="overview" className="flex-shrink-0  flex items-center gap-1 text-xs ">
              <Eye className="h-3 w-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-shrink-0  flex items-center gap-1 text-xs whitespace-nowrap px-4">
              <TrendingUp className="h-3 w-3" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="gainers" className="flex-shrink-0 flex items-center gap-1 text-xs whitespace-nowrap px-4">
              <ArrowUpRight className="h-3 w-3" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex-shrink-0  flex items-center gap-1 text-xs whitespace-nowrap px-4">
              <ArrowDownRight className="h-3 w-3" />
              Losers
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-shrink-0 flex items-center gap-1 text-xs whitespace-nowrap px-4">
              <Activity className="h-3 w-3" />
              Most Active
            </TabsTrigger>
            <TabsTrigger value="news" className="flex-shrink-0 flex items-center gap-1 text-xs whitespace-nowrap px-4">
              <Globe className="h-3 w-3" />
              News
            </TabsTrigger>
      </TabsList>
  );
};

export default TabsListComponent;
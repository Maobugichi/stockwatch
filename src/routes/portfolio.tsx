import StockNews from "@/components/ui/news";
import { fetchTrendingNews } from "@/lib/utils";
import HoldingsTable from "@/components/features/portfolio/holdingTable";

import PortfolioPie from "@/components/features/portfolio/portfolioPie/port-pie";
import { FullPageEmptyState } from "@/components/ui/empty-state";
import { ClipLoader } from "react-spinners";
import { useDashboard } from "@/hooks/useDashboard";
import SummaryCard from "@/components/features/portfolio/summaryCards";
import { Button } from "@/components/ui/button";
import { Performers } from "@/components/features/portfolio/performers";
import { UpdatedAt } from "@/components/features/portfolio/updatedAt";
import { VolumeChart } from "@/components/features/portfolio/volumeChart";

const PortfolioDashboard = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching,
    dataUpdatedAt 
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center">
        <ClipLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen grid place-items-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">Error: {error.message}</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data || !data.breakdown || data.breakdown.length === 0) {
    return (
      <div className="h-screen grid place-items-center">
        <FullPageEmptyState />
      </div>
    );
  }


  const lastUpdated = new Date(dataUpdatedAt);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);

  return (
    <div className="space-y-8 w-[94%] mx-auto font-jet">
    
      {isFetching && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 grid place-items-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
            <ClipLoader size={24} />
            <span className="text-sm font-medium">Updating portfolio...</span>
          </div>
        </div>
      )}

      <div className="space-y-3 py-4">
       <Performers/>

        <UpdatedAt minutesAgo={minutesAgo}/>
      </div>

      <SummaryCard data={data} />

      <StockNews getNewsData={fetchTrendingNews()} />

      <VolumeChart/>
      <div className="flex md:flex-row flex-col gap-5 h-auto min-h-[350px]">
        <HoldingsTable data={data} />
        <PortfolioPie data={data}  />
      </div>

    </div>
  );
};

export default PortfolioDashboard;
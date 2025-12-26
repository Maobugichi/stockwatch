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
import { useEffect } from "react";

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

  // Prevent scroll when overlay is active
  useEffect(() => {
    if (isFetching) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFetching]);

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
    
      {/* Fixed loading overlay - now uses pointer-events-none to allow scroll */}
      {isFetching && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 border border-gray-200 pointer-events-auto">
            <ClipLoader size={20} />
            <span className="text-sm font-medium text-gray-700">Updating...</span>
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
        <PortfolioPie data={data} />
      </div>

    </div>
  );
};

export default PortfolioDashboard;
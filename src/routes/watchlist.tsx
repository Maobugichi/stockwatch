import {  useWatchlist } from "@/hooks/useWatchList";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { WatchlistEmptyState } from "@/components/features/watchlist/components/watchlistEmptyState";
import type { DeleteDialogType, Stock } from "@/components/features/watchlist/types/type";
import { WatchListCard } from "@/components/features/watchlist/components/watchlistCard";
import { WatchlistDeleteDialog } from "@/components/features/watchlist/components/watchlistDeleteDialog";


const WatchList = () => {
  const { data, isLoading } = useWatchlist();
 
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogType>({
    open: false,
    symbol: null,
  });

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center">
        <ClipLoader />
      </div>
    );
  }

  const handleDeleteClick = (symbol: string) => {
    setDeleteDialog({
      open: true,
      symbol,
    });
  };
  
  if (!data || data.length === 0) {
    return (
     <WatchlistEmptyState/>
    );
  }

  return (
    <div >
      <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-[90%] md:w-[95%]  mx-auto">
        {data?.map((stock: Stock) => {
          const isUp = stock.change_percent_daily && stock.change_percent_daily > 0;
          return (
            <WatchListCard stock={stock} isUp={isUp} handleDeleteClick={handleDeleteClick}/>
          );
        })}
        <WatchlistDeleteDialog deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog}/>
      </div>
    </div>
  );
};

export default WatchList;
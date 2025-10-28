import { useIsInWatchlist , useToggleWatchlist } from "@/hooks/useWatchList";
import { ClipLoader } from "react-spinners";
import { Star } from "lucide-react";
import { Button } from "./button";

export function WatchlistToggleButton({ ticker }: { ticker: string }) {
  const isInWatchlist = useIsInWatchlist(ticker);
  const { toggle, isPending } = useToggleWatchlist();

  return (
    <Button
      variant={isInWatchlist ? "default" : "outline"}
      size="sm"
      onClick={() => toggle(ticker)}
      disabled={isPending}
      className="gap-2 w-28"
    >
      {isPending ? (
        <ClipLoader />
      ) : (
        <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
      )}
      {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </Button>
  );
}

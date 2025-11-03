import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Info, ArrowUpRight, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRemoveFromWatchlist, useWatchlist } from "@/hooks/useWatchList";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Holdings from "@/components/holdings";

interface Stock {
  symbol: string;
  company_name: string;
  current_price: number | null;
  change_percent_daily: number | null;
  market_cap: number | null;
  pe_ratio: number | null;
  volume: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low: number | null;
  sparkline: {
    timestamps: string[];
    closes: number[];
  };
}

interface UserChoiceTypeWatch {
  ticker: string;
}

const WatchList = () => {
  const { data, isLoading } = useWatchlist();
  const deleteHolding = useRemoveFromWatchlist();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    symbol: string | null;
  }>({
    open: false,
    symbol: null,
  });

  const [openWatch, setOpenWatch] = useState<boolean>(false);
  const [userChoiceWatch, setUserChoiceWatch] = useState<UserChoiceTypeWatch>({
    ticker: ""
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

  const confirmDelete = () => {
    if (deleteDialog.symbol !== null) {
      deleteHolding.mutate(deleteDialog.symbol, {
        onSuccess: () => {
          setDeleteDialog({ open: false, symbol: null });
        },
      });
    }
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Eye size={40} className="text-gray-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your watchlist is empty
            </h2>
            <p className="text-gray-500">
              Start tracking stocks you're interested in by adding them to your watchlist
            </p>
          </div>
          <Holdings
            type="watchlist"
            header={<>Add to watchlist <Eye size={20} /></>}
            open={openWatch}
            setOpen={setOpenWatch}
            userChoice={userChoiceWatch}
            setUserChoice={setUserChoiceWatch}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-[90%] md:w-full mx-auto">
        {data?.map((stock: Stock) => {
          const isUp = stock.change_percent_daily && stock.change_percent_daily > 0;
          return (
            <Card key={stock.symbol} className="rounded-3xl shadow-none border-none transition-all duration-200">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-semibold">{stock.company_name}</p>
                    <p className="text-xs text-muted-foreground">{stock.symbol}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {isUp ? (
                      <TrendingUp className="text-green-500 w-5 h-5" />
                    ) : (
                      <TrendingDown className="text-red-500 w-5 h-5" />
                    )}
                    <p
                      className={`text-sm font-jet font-medium ${
                        isUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stock.change_percent_daily
                        ? `${stock.change_percent_daily.toFixed(2)}%`
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 border rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="mt-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <p className="font-bold text-2xl font-jet">
                      {stock.current_price ? stock.current_price.toFixed(2) : "—"}
                    </p>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span>
                        <Info className="w-4 h-4 cursor-pointer" />
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <p className="text-sm">
                        <span className="font-medium">52W High:</span>{" "}
                        <span className="font-jet">
                          {stock.fifty_two_week_high
                            ? `$${stock.fifty_two_week_high}`
                            : "—"}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">52W Low:</span>{" "}
                        <span className="font-jet">
                          {stock.fifty_two_week_low
                            ? `$${stock.fifty_two_week_low}`
                            : "—"}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">P/E Ratio</span>{" "}
                        {stock.pe_ratio ? Number(stock.pe_ratio).toFixed(2) : "—"}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-jet text-muted-foreground">
                    {stock.market_cap
                      ? `$${(stock.market_cap / 1e9).toFixed(2)}B`
                      : "—"}{" "}
                    • Vol:{" "}
                    {stock.volume ? `${(stock.volume / 1e6).toFixed(2)}M` : "—"}
                  </p>
                </div>

                <div className="h-16 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stock.sparkline?.timestamps.map((t, i) => ({
                        time: new Date(t).toLocaleDateString(),
                        close: stock.sparkline.closes[i],
                      }))}
                    >
                      <Line
                        type="monotone"
                        dataKey="close"
                        stroke={isUp ? "#22c55e" : "#ef4444"}
                        dot={false}
                        strokeWidth={2}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `$${Number(value).toFixed(2)}`,
                          "Price",
                        ]}
                        labelFormatter={(label) => `Date:${label}`}
                      />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Button
                    size="sm"
                    className="bg-transparent hover:bg-gray-300"
                    onClick={() => handleDeleteClick(stock.symbol)}
                    disabled={deleteHolding.isPending}
                  >
                    <Trash2 color="black" />
                  </Button>
                  <Link
                    to={`/watchlist/${stock.symbol}`}
                    className="flex items-center gap-1"
                  >
                    View <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Holding</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteDialog.symbol} from your
                watchlist? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteHolding.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleteHolding.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteHolding.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default WatchList;
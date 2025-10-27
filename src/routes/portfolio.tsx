import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, AreaChart, Area, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

import StockNews from "@/components/ui/news";
import { fetchTrendingNews } from "@/lib/utils";
import HoldingsTable from "@/components/ui/holdingTable";
import { resolveCssVar } from "@/lib/utils";
import PortfolioPie from "@/components/ui/port-pie";
import { FullPageEmptyState } from "@/components/ui/empty-state";
import { ClipLoader } from "react-spinners";
import { useDashboard } from "@/hooks/useDashboard";
import SummaryCard from "@/components/portfolio/summaryCards";
import { Button } from "@/components/ui/button";

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

  const strokeColor = resolveCssVar("--chart-2");
  
 
  const lastUpdated = new Date(dataUpdatedAt);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);

  return (
    <div className="space-y-8 py-16 px-8 font-inter">
   
      <div className="flex items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          {data.topStock && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-300 shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span>Top:</span>
              <span className="font-semibold">{data.topStock.symbol}</span>
              <span className="text-green-600 font-jet font-bold">
                ({data.topStock.pct.toFixed(2)}%)
              </span>
            </Badge>
          )}

          {data.worstStock && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300 shadow-sm"
            >
              <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              <span>Worst:</span>
              <span className="font-semibold">{data.worstStock.symbol}</span>
              <span className="text-red-600 font-bold">
                ({data.worstStock.pct.toFixed(2)}%)
              </span>
            </Badge>
          )}
        </div>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </span>
        </Button>
      </div>

    
      {minutesAgo > 0 && (
        <p className="text-xs text-muted-foreground">
          Last updated {minutesAgo} minute{minutesAgo !== 1 ? 's' : ''} ago
        </p>
      )}

      <SummaryCard data={data} />

      <StockNews getNewsData={fetchTrendingNews()} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-fr">
        <HoldingsTable data={data} />
        <PortfolioPie data={data} />
      </div>

      <Card className="md:h-[450px] h-[400px] flex flex-col border-none shadow-none pb-0">
        <CardHeader className="text-lg sm:text-2xl p-0">
          <CardTitle>P/L per Holding</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 border rounded-2xl p-2 sm:p-3">
          <ChartContainer
            config={{
              pl: {
                label: "Profit/Loss",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={280}>
              <AreaChart
                data={data.breakdown.map((item: any) => ({
                  symbol: item.symbol,
                  pl:
                    (item.currentPrice - Number(item.buyPrice)) *
                    Number(item.shares),
                }))}
                margin={{
                  top: 5,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="symbol"
                  type="category"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={40}
                />

                <YAxis
                  domain={[
                    (dataMin: any) => Math.min(0, dataMin),
                    (dataMax: any) => Math.max(0, dataMax),
                  ]}
                  tickFormatter={(val: number) =>
                    Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(val)
                  }
                  tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "font-jet" }}
                  width={45}
                />

                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [
                    `$${Number(value).toFixed(2)}`,
                    "P/L",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="pl"
                  stroke={strokeColor}
                  fill={strokeColor}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;
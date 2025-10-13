import { Card , CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
 
} from "@/components/ui/chart";
import {  XAxis, YAxis , AreaChart, Area, ResponsiveContainer,  LineChart, Line, } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Tooltip } from "recharts";
import StockNews from "@/components/ui/news";
import { fetchTrendingNews } from "@/lib/utils";
import HoldingsTable from "@/components/ui/holdingTable";
import { resolveCssVar } from "@/lib/utils";
import PortfolioPie from "@/components/ui/port-pie";
import { FullPageEmptyState } from "@/components/ui/empty-state";
import { ClipLoader } from "react-spinners";
import { useDashboard } from "@/hooks/useDashboard";



interface SummaryCard {
  title: string;
  value: string;
  sub: string;
  color: string;
  icon?: keyof typeof iconMap;
  badge?: boolean;
  trend?: "up" | "down";
  sparkline?: number[];
  relativePerf?: number;
  showRange?: boolean;
  timestamps?:number[]
}

const iconMap = {
  wallet: Wallet,
  up: TrendingUp,
  down: TrendingDown,
};


const PortfolioDashboard = () => {


   const { data, isLoading, isError, error } = useDashboard();

   console.log(data)

    if (isLoading) {
      return <ClipLoader/>
    }

    if (isError) {
      return <div>Error: {error.message}</div>;
    }

   const summaryCards: SummaryCard[] = [
    {
      title: "Portfolio Value",
      value: `$${data.portfolioValue.toFixed(2)}`,
      sub: `Invested: $${data.investedAmount}`,
      color: "text-foreground",
      icon: "wallet",
      showRange: true,
    },
    {
      title: "Profit / Loss",
      value: `$${data.profitLoss.toFixed(2)}`,
      sub: `${data.percentGainLoss.toFixed(2)}%`,
      color: data.profitLoss >= 0 ? "text-green-600" : "text-red-600",
      badge: true,
      trend: data.profitLoss >= 0 ? "up" : "down",
      sparkline: data.profitLossHistory || [],
      relativePerf: data.percentGainLoss - (data.marketBenchmarkPercent || 0),
    },
    {
      title: "Daily Change",
      value: `$${data.dailyChange.toFixed(2)}`,
      sub: `${data.dailyChangePercent.toFixed(2)}%`,
      color: data.dailyChange >= 0 ? "text-green-600" : "text-red-600",
      badge: true,
      trend: data.dailyChange >= 0 ? "up" : "down",
      sparkline: data.dailyHistory || [],
    },
    
   ];
 
  const percentInRange = Math.max(0, Math.min(100, ((data.portfolioValue - data.low52) / (data.high52 - data.low52)) * 100));

    const strokeColor = resolveCssVar("--chart-2");
    return(
      <>
      {
        data ?
      
        <div className="space-y-6 p-6 font-inter">
            <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
               {summaryCards.map((card, idx) => {
                    const Icon = card.icon ? iconMap[card.icon] : null;
                    return (
                    <Card  className="rounded-2xl " key={idx}>
                        <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        {Icon && <Icon className="w-10 h-10 text-muted-foreground" />}
                        {card.trend === "up" && (
                            <ArrowUpRight className="text-green-600 w-4 h-4" />
                        )}
                        {card.trend === "down" && (
                            <ArrowDownRight className="text-red-600 w-4 h-4" />
                        )}
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div className={`text-3xl font-jet font-bold ${card.color}`}>
                                {card.value}
                            </div>

                            {card.badge ? (
                                <Badge className="font-jet" variant="secondary">{card.sub}</Badge>
                            ) : (
                                <p className="text-sm text-muted-foreground ">{card.sub}</p>
                            )}

                            {card.relativePerf !== undefined && (
                                <p className="text-xs mt-1 text-muted-foreground">
                                {card.relativePerf >= 0 ? "Outperforming" : "Underperforming"}{" "}
                                Market by {card.relativePerf.toFixed(2)}%
                                </p>
                            )}

                            {card.sparkline && card.sparkline?.length > 0 && (
                                <ResponsiveContainer width="100%" height={40}>
                                <LineChart
                                    data={card.sparkline.map((v, i) => ({ 
                                    index: i, 
                                    value: v,
                                    
                                    time: card.timestamps ? new Date(card.timestamps[i]).toLocaleDateString() : `Point ${i + 1}`
                                    }))}
                                >
                                    <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={
                                        card.color.includes("green") ? "#22c55e" : "#ef4444"
                                    }
                                    strokeWidth={2}
                                    dot={false}
                                    />
                                    <Tooltip
                                    formatter={(value:any) => [
                                        `${typeof card.value === 'string' && card.value.includes('$') 
                                        ? `$${Number(value).toFixed(2)}` 
                                        : Number(value).toFixed(2)}`,
                                        card.title
                                    ]}
                                    labelFormatter={(label:any) => 
                                        card.timestamps ? `Date: ${label}` : `Data Point: ${label}`
                                    }
                                    contentStyle={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '12px'
                                    }}
                                    />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={["auto", "auto"]} />
                                </LineChart>
                                </ResponsiveContainer>
                            )}

                            {card.showRange && data.low52 && data.high52 && (
                                <div className="mt-2 space-y-5">
                                <Progress
                                    value={percentInRange}
                                    className="h-2 bg-gray-200 rounded-full [&>div]:bg-green-500"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    52w Range: ${data.low52.toFixed(2)} – ${data.high52.toFixed(2)}
                                </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    );
                })} 

            </div>
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
            <StockNews getNewsData={fetchTrendingNews()}/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-fr">
                <HoldingsTable data={data}/>
                <PortfolioPie data={data}/>
            </div>
            
           <Card className=" md:h-[450px] h-[400px] flex flex-col border-none shadow-none pb-0">
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
                    data={data.breakdown.map((item:any) => ({
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
                      angle={-30} // tilt labels so they don’t overlap
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
                      tick={{ fontSize: 10, fill: "#6b7280",fontFamily:'font-jet' }}
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

        </div>: <div className="h-screen grid place-items-center">
                 <FullPageEmptyState/>
               </div> 
                 }
        </>

    )
}

export default PortfolioDashboard
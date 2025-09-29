import { useLoaderData } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";

import TimePeriodDropdown from "./chart_drop";
import { formatNumber, getNewsData } from "@/lib/utils";
import ValuationTable from "./val-table";
import type { StockData } from "@/types";
import EventsInfoTable from "./events";
import StockNews from "./news";
import Candlestick from "./candleStick";
import { useState } from "react";
import Volume from "./volume";
import EarningsRevenueChart from "./earnings";
import AnalystRecommendationsChart from "./recommendations";
import EarningsEstimatesChart from "./estimate";

const StockDetails = () => {
  const stock: StockData | undefined = useLoaderData();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("3m");

  if (!stock) return <div>Loading...</div>;

  const hasCandlestick = stock.ohlc_history?.length;
  const hasVolume = stock.volume_history?.length;
  const hasEarningsRevenue = stock.earnings_yearly?.length;
  const hasRecommendations = stock.recommendations?.length;
  const hasEarningsEstimates = stock.earnings_estimates?.length;

  const ChangeIndicator = ({ value }: { value: number | undefined }) => {
    if (value === undefined) return <Minus className="w-4 h-4 text-gray-400" />;
    if (value > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="grid w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
     
      <div className="flex mt-10 md:mt-0 flex-col md:flex-row md:items-center md:justify-between gap-2 h-20">
        <h1 className="text-2xl font-bold">
          {stock.company_name ?? "Unknown"} ({stock.symbol ?? "N/A"})
        </h1>
        <div>
          <span className="font-jet">${stock.current_price?.toFixed(2) ?? "N/A"}</span>
          <div className="flex">
            <ChangeIndicator value={stock.change_percent_daily} />
            <span
              className={
                `${stock.change_percent_daily
                  ? stock.change_percent_daily > 0
                    ? "text-green-600 text-xs"
                    : stock.change_percent_daily < 0
                    ? "text-red-600 text-xs"
                    : "text-gray-500 text-xs"
                  : "text-gray-400 text-xs"} font-jet`
              }
            >
              {stock.change_percent_daily !== undefined
                ? (stock.change_percent_daily * 100).toFixed(2) + "%"
                : "—"}
            </span>
          </div>
        </div>
      </div>

     
      {(hasCandlestick || hasVolume) && (
        <div
          className={`grid gap-6  ${
            hasCandlestick && hasVolume ? "grid-rows-[11fr_9fr]" : "grid-rows-1"
          }`}
        >
          {hasCandlestick && (
            <Candlestick
              stock={stock}
              timePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
            />
          )}
          {hasVolume && <Volume stock={stock} />}
        </div>
      )}


     
      {stock && <ValuationTable stock={stock} />}

      
      {stock.symbol && <StockNews getNewsData={getNewsData(stock.symbol)} />}

    
      {(hasEarningsRevenue || hasRecommendations) && (
        <div className={`grid gap-5 ${hasEarningsRevenue && hasRecommendations ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {hasEarningsRevenue && (
            <EarningsRevenueChart stock={stock}/>
          )}

          {hasRecommendations && (
           <AnalystRecommendationsChart stock={stock}/>
          )}
        </div>
      )}

      
      {(hasEarningsEstimates || stock) && (
        <div className={`grid gap-8 ${hasEarningsEstimates ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {hasEarningsEstimates && (
            <EarningsEstimatesChart stock={stock}/>
          )}

          <div className="space-y-4">
            <EventsInfoTable stock={stock} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;

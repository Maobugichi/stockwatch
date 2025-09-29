import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  LineChart as ReLineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {  useRef } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  BarChart2,
  Flame,
  Snowflake,
  DollarSign,
  Euro,
  Bitcoin,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";


function StockCard({ stock, showSparklineChange, navigate, badge }: any) {

 function getCurrencyIcon(curr: string) {
  switch (curr) {
    case "USD":
      return <DollarSign className="w-3 h-3 text-gray-600" />;
    case "EUR":
      return <Euro className="w-4 h-4 text-blue-600" />;
    case "BTC":
      return <Bitcoin className="w-4 h-4 text-orange-500" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-500" />;
  }
}
  const change = showSparklineChange
    ? stock.sparklineChangePercent ?? 0
    : stock.changePercent ?? 0;
  const sparkColor = change >= 0 ? "#22c55e" : "#ef4444";
  const cardRef = useRef<HTMLDivElement>(null);

 
 
  let sparkData: any[] = [];
  if (stock.sparkline?.length > 0) {
    sparkData = (showSparklineChange ? stock.sparkline : stock.sparkline.slice(-7)).map(
      (v: any, i: number) => ({
        index: i,
        value: v.price,
        time: `Day ${i + 1}`,
      })
    );
  }

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative" ref={cardRef}>
        <Card
          className="relative z-10 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition bg-white dark:bg-gray-900"
          onClick={() => navigate(`/watchlist/${stock.symbol}`)}
        >
         
          <CardHeader className="flex p-0 justify-between items-center mb-2">
            <div className="flex items-center gap-1 font-semibold">
              {stock.symbol}
              {badge === "gainer" && <Flame className="w-4 h-4 text-orange-500" />}
              {badge === "loser" && <Snowflake className="w-4 h-4 text-blue-500" />}
            </div>
            <div
              className={`text-sm font-medium flex items-center gap-1 ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {change.toFixed(2)}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-2">{stock.shortName}</div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1">
                {stock.price.toFixed(2)} {getCurrencyIcon(stock.currency)}
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 className="w-3 h-3 text-gray-500" />
                {stock.volume ? formatNumber(stock.volume) : "-"}
              </span>
            </div>
            {sparkData.length > 0 && (
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={sparkData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={sparkColor}
                      strokeWidth="2"
                      dot={false}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val.toFixed(2)}`, stock.symbol]}
                      labelFormatter={(label: any) => `${label}`}
                    />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              MC: {stock.marketCap ? formatNumber(stock.marketCap) : "-"}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default StockCard
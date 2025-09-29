import { Card , CardHeader, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/types";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/lib/utils";
import {
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Bitcoin } from "lucide-react";

interface CryptoProps {
    dashboardData:DashboardData
}

const Crypto:React.FC<CryptoProps> = ({dashboardData}) => {
    const navigate = useNavigate();

    const cryptoColors: Record<string, string> = {
        BTC: "#f97316", 
        ETH: "#6366f1", 
        SOL: "#0ea5e9", // sky blue
        BNB: "#22c55e", 
        ADA: "#9333ea", // purple
    };



    function getCryptoColor(symbol: string) {
     return cryptoColors[symbol] || "#a3a3a3"; 
    }
    console.log(dashboardData)
    return (
        <>
            {dashboardData.crypto?.length > 0 && (
                <Card className="flex flex-col">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                        <Bitcoin className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Cryptocurrency</span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 max-h-64 overflow-y-auto scrollbar-hide">
                        <div className="space-y-4">
                        {dashboardData.crypto.map((crypto: any) => {
                        
                            const color = getCryptoColor(crypto.symbol.slice(0,3));
                            const chartData =
                            crypto.sparkline?.map((point: any) => ({
                                date: new Date(point.date).toLocaleDateString(),
                                price: point.price,
                            })) || [];

                            return (
                            <div
                                key={crypto.symbol}
                                onClick={() => navigate(`/crypto/${crypto.symbol}`)}
                                className="flex flex-col gap-2 border-b last:border-b-0 pb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md px-2"
                            >
                                <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-sm">{crypto.name}</div>
                                    <div className="text-xs text-gray-500">{crypto.symbol}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold">
                                    ${formatNumber(crypto.price?.toFixed(2))}
                                    </div>
                                    <div
                                    className={`text-xs ${
                                        crypto.changePercent >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                    >
                                    {crypto.changePercent >= 0 ? "+" : ""}
                                    {crypto.changePercent?.toFixed(2)}%
                                    </div>
                                </div>
                                </div>

                                {chartData.length > 0 && (
                                <div className="h-16">
                                    <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                        <linearGradient
                                            id={`cryptoGradient-${crypto.symbol}`}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                                        </linearGradient>
                                        </defs>
                                        <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke={color}
                                        fillOpacity={1}
                                        fill={`url(#cryptoGradient-${crypto.symbol})`}
                                        strokeWidth={2}
                                        />
                                        <Tooltip
                                        formatter={(value: any) => [`$${formatNumber(value)}`, "Price"]}
                                        labelFormatter={(label: any) => label}
                                        />
                                    </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                )}
                            </div>
                            );
                        })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default Crypto
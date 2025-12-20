
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  XAxis, YAxis , ResponsiveContainer,  LineChart, Line, } from "recharts";
import { Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WalletIcon , CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";

const iconMap = {
  wallet: WalletIcon,
  up: CaretUpIcon,
  down: CaretDownIcon,
};


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

 
 interface SummaryProp {
    data:any
 }
 

const SummaryCard:React.FC<SummaryProp> = ({ data }) => {
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
    return(
        <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
               {summaryCards.map((card, idx) => {
                    const Icon = card.icon ? iconMap[card.icon] : null;
                    const TrendIcon = card.trend === "up" ? CaretUpIcon : card.trend === "down" ? CaretDownIcon : null;
                 
                    return (
                    <Card  className="rounded-3xl " key={idx}>
                       <CardHeader className="flex  flex-row items-center justify-between ">
                        <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                        <div className="flex items-center gap-2">
                            {Icon && (
                            <div className={`p-2 rounded-lg ${
                                card.color.includes("green") 
                                ? "bg-green-50"
                                : card.color.includes("red")
                                ? "bg-red-50"
                                : "bg-blue-50"
                            } transition-transform group-hover:scale-110 duration-300`}>
                                <Icon weight="fill" className={` ${
                                card.color.includes("green") 
                                    ? "text-green-600"
                                    : card.color.includes("red")
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`} />
                            </div>
                            )}
                            {TrendIcon && (
                            <div className={`p-1.5 rounded-lg ${
                                card.trend === "up" ? "bg-green-50" : "bg-red-50"
                            }`}>
                                <TrendIcon weight="fill" className={` ${
                                card.trend === "up" ? "text-green-600" : "text-red-600"
                                }`} />
                            </div>
                            )}
                        </div>
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
                                <ResponsiveContainer width="100%" height={25}>
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
    )
}

export default SummaryCard
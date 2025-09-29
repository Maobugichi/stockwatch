import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import type { StockData } from "@/types";

type VolumeProps = {
    stock: StockData
}

const Volume: React.FC<VolumeProps> = ({ stock }) => {
   
    const formatXAxisDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    
    const formatTooltipDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

  
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">
                        {formatTooltipDate(label)}
                    </p>
                    <p className="text-sm text-blue-600">
                        Volume: {Intl.NumberFormat("en-US", { notation: "compact" }).format(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full min-w-0">
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>Volume (Last 30 days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[90%] p-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                        <AreaChart 
                            data={stock.volume_history ?? []} 
                            margin={{ top: 0, right: 25, left: 10, bottom: 2 }}
                        >
                            <XAxis 
                                dataKey="date"
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                tickFormatter={formatXAxisDate}
                                interval="preserveStartEnd"
                                minTickGap={30}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                            />
                            <YAxis
                                tickFormatter={(val) =>
                                    val !== undefined
                                        ? Intl.NumberFormat("en-US", { notation: "compact" }).format(val)
                                        : "—"
                                }
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                width={50}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.1}
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default Volume
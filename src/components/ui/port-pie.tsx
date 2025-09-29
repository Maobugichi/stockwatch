import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import type { PortfolioData } from "@/types";
import { resolveCssVar } from "@/lib/utils";

const PortfolioPie = ({ data }: { data: PortfolioData }) => {
    const chartColors = [
        resolveCssVar("--chart-1"),
        resolveCssVar("--chart-2"),
        resolveCssVar("--chart-3"),
        resolveCssVar("--chart-4"),
        resolveCssVar("--chart-5"),
    ];

    const chartConfig: ChartConfig = Object.fromEntries(
        data.breakdown.map((item: any, index: number) => [
            item.symbol,
            {
                label: item.symbol,
                color: chartColors[index % chartColors.length], 
            },
        ])
    );

    
    const totalValue = data.breakdown.reduce((sum, item) => 
        sum + (Number(item.shares) * item.currentPrice), 0
    );

    const chartData = data.breakdown.map(item => {
        const value = Number(item.shares) * item.currentPrice;
        const percentage = ((value / totalValue) * 100).toFixed(1);
        
        return {
            name: item.symbol,
            value: value,
            percentage: percentage,
            displayValue: `$${value.toLocaleString()}`
        };
    });


    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg text-xs sm:text-sm">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-gray-600">
                        Value: {data.displayValue}
                    </p>
                    <p className="text-gray-600">
                        Share: {data.percentage}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full  flex flex-col border-none shadow-none pb-0">
            <CardHeader className="p-0  shrink-0">
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Allocation</CardTitle>
            </CardHeader>
            <CardContent className="border rounded-2xl p-2 flex-1 ">
                <ChartContainer className="w-full h-full flex items-center justify-center" config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius="65%" 
                                outerRadius="90%"
                                paddingAngle={2.5} 
                                labelLine={false}
                               
                            >
                                {chartData.map((item, index) => (
                                    <Cell
                                        key={`cell-${item}-${index}`}
                                        fill={chartConfig[data.breakdown[index].symbol]?.color || chartColors[index % chartColors.length]}
                                        stroke="#ffffff"
                                        strokeWidth={1}
                                    />
                                ))}
                            </Pie>
                            
                          
                            <text 
                                x="50%" 
                                y="50%" 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                className="fill-foreground text-sm sm:text-base md:text-lg font-semibold"
                            >
                                Total
                            </text>
                            <text 
                                x="50%" 
                                y="50%" 
                                dy="1.2em"
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                className="fill-muted-foreground text-xs font-jet sm:text-sm"
                            >
                                ${totalValue.toLocaleString()}
                            </text>
                            
                            <ChartTooltip content={<CustomTooltip />} />
                            <ChartLegend 
                                content={<ChartLegendContent />}
                                verticalAlign="bottom"
                                height={30}
                                wrapperStyle={{
                                    display: "flex",
                                    flexWrap: "wrap",   
                                    justifyContent: "center",
                                    fontSize: "10px",
                                    rowGap: "4px",
                                }}
                               />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default PortfolioPie;
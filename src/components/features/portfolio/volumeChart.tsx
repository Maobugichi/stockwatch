import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboard } from "@/hooks/useDashboard";
import { resolveCssVar } from "@/lib/utils";
import { XAxis, YAxis, AreaChart, Area, ResponsiveContainer } from "recharts";


export const VolumeChart = () => {
    const { data } = useDashboard();
    const strokeColor = resolveCssVar("--chart-2");
    return(
      <Card className="md:h-[450px] h-[400px] flex flex-col border-none shadow-none pb-0">
        <CardHeader className="text-lg sm:text-2xl p-0">
          <CardTitle>P/L per Holding</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 border rounded-2xl px-2 pt-5 sm:p-3">
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

    )
}
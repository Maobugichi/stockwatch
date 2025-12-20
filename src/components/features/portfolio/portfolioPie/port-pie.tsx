import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { PortfolioData } from "@/types";
import { buildChartConfig } from "./utils/buildChartConfig";
import { buildPortfolioChartData } from "./utils/buildPortfolioChartData";
import { CustomTooltip } from "./customToolTip";
import { chartColors } from "./utils/resolveCssVar";


const PortfolioPie = ({ data }: { data: PortfolioData }) => {
  const chartConfig = buildChartConfig(data.breakdown);
  const { chartData, totalValue } = buildPortfolioChartData(data.breakdown);

  return (
    <Card className="flex-1  flex flex-col border-none w-full md:w-[35%] shadow-none pb-0">
      <CardHeader className="p-0 shrink-0">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Allocation
        </CardTitle>
      </CardHeader>

      <CardContent className="border rounded-2xl p-2 flex-1">
        <ChartContainer
          className="w-full h-full flex items-center justify-center"
          config={chartConfig}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                paddingAngle={2.5}
                labelLine={false}
              >
                {chartData.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={
                      chartConfig[item.name]?.color ??
                      chartColors[index % chartColors.length]
                    }
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>

              <text
                x="50%"
                y="40%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-sm sm:text-base md:text-lg font-semibold"
              >
                Total
              </text>

              <text
                x="50%"
                y="45%"
                dy="1.2em"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs sm:text-sm font-jet"
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

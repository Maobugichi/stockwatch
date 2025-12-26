import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type EarningsProps = {
  stock: any;
};

const EarningsRevenueChart: React.FC<EarningsProps> = ({ stock }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatNumber = (val: number) =>
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(val);

  return (
    <Card className="w-full rounded-3xl bg-[#14151C] border border-[rgba(34,36,45,0.5)]">
      <CardHeader>
        <CardTitle className="text-sm text-white sm:text-lg">Earnings vs Revenue</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-80 p-1 sm:p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stock.earnings_yearly ?? []}
            margin={{ top: 10, right: 20, left: 5, bottom: isMobile ? 0 : 10 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
            />
            <YAxis
              tickFormatter={(val) =>
                val !== undefined ? formatNumber(val) : "—"
              }
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
            />
            <Tooltip
              formatter={(val: number) => `$${formatNumber(val)}`}
            />
            <Legend
              wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
            />
            <Bar
              dataKey="revenue"
              fill="#0ea5e9"
              stroke="#0284c7"
              barSize={isMobile ? 25 : 40}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="earnings"
              fill="#8b5cf6"
              stroke="#6d28d9"
              barSize={isMobile ? 25 : 40}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EarningsRevenueChart;

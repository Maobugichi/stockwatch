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

type EarningsEstimatesProps = {
  stock: any;
};

const EarningsEstimatesChart: React.FC<EarningsEstimatesProps> = ({ stock }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="rounded-sm w-full">
      <CardHeader>
        <CardTitle className="text-sm sm:text-lg">Earnings Estimates</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-80 p-1 sm:p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stock.earnings_estimates ?? []}
            margin={{ top: 10, right: 20, left: -10, bottom: isMobile ? 0 : 10 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
            />
            <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }} />
            <Bar dataKey="estimate" fill="#f59e0b" barSize={isMobile ? 25 : 30} radius={[3, 3, 0, 0]} />
            <Bar dataKey="actual" fill="#10b981" barSize={isMobile ? 25 : 30} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EarningsEstimatesChart;

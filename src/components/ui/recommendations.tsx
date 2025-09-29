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

type RecommendationsProps = {
  stock: any;
};

const AnalystRecommendationsChart: React.FC<RecommendationsProps> = ({ stock }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="w-full rounded-sm">
      <CardHeader>
        <CardTitle className="text-sm sm:text-lg">Analyst Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-80 p-1 sm:p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stock.recommendations ?? []}
            margin={{ top: 10, right: 20, left: -20, bottom: isMobile ? 0 : 10 }}
          >
            <XAxis
              dataKey="period"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
            />
            <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }} />
            <Bar dataKey="strongBuy" stackId="a" fill="#16a34a" barSize={isMobile ? 35 : 75} />
            <Bar dataKey="buy" stackId="a" fill="#22c55e" barSize={isMobile ? 20 : 35} />
            <Bar dataKey="hold" stackId="a" fill="#facc15" barSize={isMobile ? 20 : 35} />
            <Bar dataKey="sell" stackId="a" fill="#f97316" barSize={isMobile ? 20 : 35} />
            <Bar dataKey="strongSell" stackId="a" fill="#dc2626" barSize={isMobile ? 20 : 35} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalystRecommendationsChart;

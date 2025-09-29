import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const HoldingsTable = ({ data }: { data: PortfolioData }) => {
  const navigate = useNavigate()
;  return (
    <Card className="h-full flex flex-col rounded-sm border-none shadow-none md:col-span-2  pb-0">
      <CardHeader className="text-2xl p-0 shrink-0">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Holdings Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent className="border rounded-2xl p-0 sm:p-2 flex-1 h-full overflow-hidden">
       
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[600px]  text-xs sm:text-sm">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="px-2 py-1 sm:px-4 font-bold">Symbol</TableHead>
                <TableHead className="px-2 py-1 sm:px-4">Shares</TableHead>
                <TableHead className="px-2 py-1 sm:px-4">Buy Price</TableHead>
                <TableHead className="px-2 py-1 sm:px-4">Current</TableHead>
                <TableHead className="px-2 py-1 sm:px-4">Prev Close</TableHead>
                <TableHead className="px-2 py-1 sm:px-4">P/L</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.breakdown.map((item: any, idx: number) => {
                const pl =
                  (item.currentPrice - Number(item.buyPrice)) *
                  Number(item.shares);
                return (
                  <TableRow
                    key={idx}
                    className="h-10 cursor-pointer sm:h-14 text-xs sm:text-sm"
                    onClick={() => navigate(`/watchlist/${item.symbol}`)} 
                  >
                    <TableCell className="font-medium px-2 py-1 sm:px-4">
                      {item.symbol}
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:px-4 font-jet">
                      {item.shares}
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:px-4 font-jet">
                      ${item.buyPrice}
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:px-4 font-jet">
                      ${item.currentPrice}
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:px-4 font-jet">
                      ${item.prevClose}
                    </TableCell>
                    <TableCell className="px-2 py-1 sm:px-4 font-jet">
                      <Badge
                        className={`${
                          pl >= 0 ? "bg-green-500" : "bg-red-500"
                        } rounded-full text-[10px] sm:text-xs px-2 py-0.5 sm:px-2 sm:py-1`}
                      >
                        ${pl.toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  BarChart3,
  Percent,
  Activity,
  Users,
} from "lucide-react"

import { formatNumber } from "@/lib/utils"
import type { StockData } from "@/types"

type ValuationTableProps = {
    stock:StockData
}


const ValuationTable =  ( {stock} :ValuationTableProps) => {
  return (
    <div className="rounded-3xl border bg-card shadow-sm pb-4">
      <Table>
        <TableBody>
         
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell colSpan={2} className="text-lg font-semibold text-muted-foreground p-4">
              Valuation
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Market Cap
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              ${formatNumber(stock.market_cap)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              P/E Ratio
            </TableCell>
            <TableCell className="font-jet text-right font-medium p-3">
              {stock.pe_ratio?.toFixed(2) ?? "N/A"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              PEG Ratio
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.peg_ratio?.toFixed(2) ?? "N/A"}
            </TableCell>
          </TableRow>

          
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell colSpan={2} className="text-sm font-semibold text-muted-foreground p-3">
              Risk & Performance
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <Activity className="w-4 h-4 text-muted-foreground" />
              Beta
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.beta?.toFixed(2) ?? "N/A"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Enterprise Value
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              ${formatNumber(stock.enterprise_value)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              Price/Book
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.price_to_book?.toFixed(2) ?? "N/A"}
            </TableCell>
          </TableRow>

        
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell colSpan={2} className="text-sm font-semibold text-muted-foreground p-3">
              Dividends & Shares
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              Shares Out.
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {formatNumber(stock.shares_outstanding)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 p-3">
              <Percent className="w-4 h-4 text-muted-foreground" />
              Dividend Yield
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.dividend_yield != null
                ? `${(stock.dividend_yield * 100).toFixed(2)}%`
                : "N/A"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="flex items-center gap-2 ">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              Price/Sales
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.price_to_sales?.toFixed(2) ?? "N/A"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ValuationTable
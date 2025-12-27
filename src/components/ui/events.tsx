import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Briefcase, Factory, Users, CalendarDays, DollarSign } from "lucide-react"
import type { StockData } from "@/types"  

type EventsInfoTableProps = {
  stock: StockData
}

const EventsInfoTable = ({ stock }: EventsInfoTableProps) => {
  return (
    <Card className="rounded-3xl bg-[#14151C]  border-[rgba(34,36,45,0.5)] border p-0  shadow-sm">
      <Table className="p-0">
        <TableBody>
         
          <TableRow className="bg-gray-300/20 hover:bg-muted/30 ">
            <TableCell colSpan={2} className="text-lg text-white rounded-t-3xl font-semibold  p-4">
              Upcoming Events
            </TableCell>
          </TableRow>

        
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              Next Earnings
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.next_earnings_date
                ? new Date(stock.next_earnings_date).toLocaleDateString()
                : "N/A"}
            </TableCell>
          </TableRow>

          
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Next Dividend
            </TableCell>
            <TableCell className="text-right font-medium p-3">
              {stock.next_dividend_date
                ? new Date(stock.next_dividend_date).toLocaleDateString()
                : "N/A"}
            </TableCell>
          </TableRow>

          
          <TableRow className="bg-gray-300/20 hover:bg-muted/30">
            <TableCell colSpan={2} className="text-lg font-semibold text-white p-3">
              Company Info
            </TableCell>
          </TableRow>

          
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Sector
            </TableCell>
            <TableCell className="text-right font-medium p-3">
              {stock.sector ?? "N/A"}
            </TableCell>
          </TableRow>

          
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              <Factory className="w-4 h-4 text-muted-foreground" />
              Industry
            </TableCell>
            <TableCell className="text-right font-medium p-3">
              {stock.industry ?? "N/A"}
            </TableCell>
          </TableRow>

         
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              Employees
            </TableCell>
            <TableCell className="text-right font-jet font-medium p-3">
              {stock.employees !== undefined ? stock.employees.toLocaleString() : "N/A"}
            </TableCell>
          </TableRow>

          
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Headquarters
            </TableCell>
            <TableCell className="text-right font-medium p-3">
              {stock.headquarters ?? "N/A"}
            </TableCell>
          </TableRow>

          
          <TableRow className="text-white">
            <TableCell className="flex items-center gap-2 p-3">
              Website
            </TableCell>
            <TableCell className="text-right font-medium p-3">
              {stock.website ? (
                <a
                  href={stock.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {stock.website}
                </a>
              ) : (
                "N/A"
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}

export default EventsInfoTable

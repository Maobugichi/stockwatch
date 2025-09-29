import { formatNumber } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  LineChart,
  Cpu,
  Activity,
} from "lucide-react"
import type { DashboardData } from "@/types"

interface IndicesProps {
  dashboardData: DashboardData
}

const Indices: React.FC<IndicesProps> = ({ dashboardData }) => {
  function getIndexIcon(symbol: string) {
    switch (symbol) {
      case "^GSPC":
        return <LineChart className="w-4 h-4 text-blue-600" />
      case "^DJI":
        return <Landmark className="w-4 h-4 text-amber-600" />
      case "^IXIC":
        return <Cpu className="w-4 h-4 text-purple-600" />
      case "^VIX":
        return <Activity className="w-4 h-4 text-red-600" />
      default:
        return <LineChart className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
        justify-items-stretch
      "
    >
      {dashboardData.marketIndices?.map((index: any) => (
        <Card
          key={index.symbol}
          className="
            p-3 rounded-lg border bg-white/70 shadow-sm
            hover:shadow-md hover:scale-[1.01]
            transition-all duration-200
            h-full flex flex-col justify-between
          "
        >
          <div className="flex justify-between items-start mb-2">
            {/* Icon + Name */}
            <div className="flex items-center gap-1.5">
              {getIndexIcon(index.symbol)}
              <span className="font-semibold text-xs">{index.name}</span>
            </div>

            {/* Change Badge */}
            <div
              className={`text-[10px] font-medium flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                index.changePercent >= 0
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {index.changePercent >= 0 ? (
                <ArrowUpRight className="w-2.5 h-2.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5" />
              )}
              {index.changePercent?.toFixed(2)}%
            </div>
          </div>

          {/* Value */}
          <div className="text-lg font-bold">
            {formatNumber(index.value?.toFixed(2))}
          </div>

          {/* Sub info */}
          <div className="text-[11px] text-gray-500 mt-1">
            Vol: {formatNumber(index.volume)}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Indices

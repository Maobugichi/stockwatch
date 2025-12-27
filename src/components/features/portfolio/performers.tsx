import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/hooks/useDashboard";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { RefreshCw } from "lucide-react"

export const Performers = () => {
     const { 
        data, 
        refetch,
        isFetching
      } = useDashboard();
    
    return(
         <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {data.topStock && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100/20 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-300 shadow-sm"
              >
                <CaretUpIcon weight="fill" className=" text-green-400" />
                <span>Top:</span>
                <span className="font-semibold">{data.topStock.symbol}</span>
                <span className="text-green-600 font-jet font-bold">
                  ({data.topStock.pct.toFixed(2)}%)
                </span>
              </Badge>
            )}

            {data.worstStock && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100/20 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300 shadow-sm"
              >
                <CaretDownIcon weight="fill" className="text-red-600" />
                <span>Worst:</span>
                <span className="font-semibold">{data.worstStock.symbol}</span>
                <span className="text-red-600 font-bold">
                  ({data.worstStock.pct.toFixed(2)}%)
                </span>
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 border border-[#526FFF] bg-[#526FFF]/10 text-[#526FFF]"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </span>
          </Button>
        </div>
    )
}
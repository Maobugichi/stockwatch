import { useStockDashboard } from "@/components/features/dashboard/hooks/useStockDashboardContext"
import { ArrowRight, Building2 } from "lucide-react"
import { Link } from "react-router-dom"

export const SearchResult = ({item}:{item:any}) => {
    const { handleSelect } = useStockDashboard();
    return(
         <Link to={`/watchlist/${item.symbol}`}>
            <div
            key={item.symbol}
            className="group relative flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b last:border-b-0 transition-all duration-200"
            onClick={() => handleSelect(item)}
            >
            
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-black to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                </div>
                <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {item.symbol}
                    {item.exchange && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                        {item.exchange}
                    </span>
                    )}
                </div>
                <div className="text-sm text-gray-600 truncate mt-0.5">
                    {item.name}
                </div>
                </div>
            </div>
            
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </div>
         </Link>
    )
}
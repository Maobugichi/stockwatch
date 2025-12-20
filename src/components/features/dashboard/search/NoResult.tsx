import { Search } from "lucide-react"
import { useStockDashboard } from "../hooks/useStockDashboardContext"

export const NoResult = () => {
    const { searchTerm } = useStockDashboard();
    return(
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
             <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
            <p className="text-xs text-gray-500">Try searching for "{searchTerm}" again</p>
           </div>
    )
}
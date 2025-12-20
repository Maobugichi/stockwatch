import { RefreshCw } from "lucide-react"

export const Searching = () => {
    return(
         <div className="p-6 text-center ">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-blue-500" />
            <p className="text-sm text-gray-600 font-medium">Searching markets...</p>
        </div>
    )
}
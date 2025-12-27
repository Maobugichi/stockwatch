import { Badge } from "../badge";
import { RefreshCw } from "lucide-react";
import { Button } from "../button"
import ModernTickerSearch from "./search";
import { useStockDashboard } from "@/components/features/dashboard/hooks/useStockDashboardContext";



const Header = () => {
    const {  refreshing,  handleRefresh  } = useStockDashboard()
    return (
        <div className="bg-[#06070B]  border-b  border-gray-900/50 text-[rgb(252,252,252)] relative">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex md:flex-row flex-col justify-between gap-3 space-y-3">
                    <div className="flex w-full  items-center gap-4">
                        <h1 className="text-2xl font-bold ">Stock Dashboard</h1>
                        <Badge variant="outline" className="text-green-600 rounded-full mt-1">
                            Live Data
                        </Badge>
                    </div>

                    <div className="flex gap-2 w-full md:w-[60%]">
                        <ModernTickerSearch />

                        <Button
                         disabled={refreshing}
                         onClick={handleRefresh}
                         className=" h-10 border border-[#526FFF] bg-[#526FFF]/10 text-[#526FFF] rounded-3xl"
                        >
                        <RefreshCw className={`h-4 w-4   ${refreshing ? 'animate-spin' : ''}`} />
                        
                        </Button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
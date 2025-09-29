import type { DashboardData } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Button } from "../button";
import { Card } from "../card";
import { useNavigate } from "react-router-dom";

interface EarningsProps {
    dashboardData: DashboardData
}
const Earnings:React.FC<EarningsProps> = ({dashboardData}) => {
    const navigate = useNavigate();
    return(
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.earningsCalendar?.slice(0, 9).map((event: any) => (
            <Card key={`${event.symbol}-${event.date}`} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-semibold text-lg">{event.symbol}</div>
                    <div className="text-sm text-gray-600">{event.companyName || event.symbol}</div>
                </div>
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Earnings
                </div>
                </div>
                
                <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                {event.epsEstimate && (
                    <div className="flex justify-between">
                    <span className="text-gray-600">EPS Est:</span>
                    <span className="font-medium">${event.epsEstimate.toFixed(2)}</span>
                    </div>
                )}
                {event.revenueEstimate && (
                    <div className="flex justify-between">
                    <span className="text-gray-600">Rev Est:</span>
                    <span className="font-medium">${formatNumber(event.revenueEstimate)}</span>
                    </div>
                )}
                </div>
                
                <Button
                 className="w-full mt-3"
                 clicked={() => navigate(`/stock/${event.symbol}`)}
                >
                 View Details
                </Button>
            </Card>
            ))}
        </div>
    )
}

export default Earnings
import { Card , CardHeader, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/types";
import {
  
  Calendar,
 
} from "lucide-react";

interface IpoProps {
    dashboardData: DashboardData
}

const Ipo:React.FC<IpoProps> = ({ dashboardData}) => {
    return(
        <>
           {dashboardData.ipos?.length > 0 && (
            <Card>
                <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Upcoming IPOs</span>
                </div>
                </CardHeader>
                <CardContent className="pt-0">
                <div className="space-y-3">
                    {dashboardData.ipos.slice(0, 4).map((ipo: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                        <div className="font-medium text-sm">{ipo.name || ipo.symbol}</div>
                        <div className="text-xs text-gray-500">{ipo.symbol}</div>
                        </div>
                        <div className="text-xs text-gray-600">
                        {new Date(ipo.date).toLocaleDateString()}
                        </div>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            )}
        </>
       
    )
}

export default Ipo
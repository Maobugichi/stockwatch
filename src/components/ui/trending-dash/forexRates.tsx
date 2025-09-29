import { Card , CardHeader, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/types";
import { Globe } from "lucide-react";

interface ForexProps {
    dashboardData:DashboardData
}

const ForexRates:React.FC<ForexProps> = ({ dashboardData }) => {
    return(
        <>
            {dashboardData.forexRates && Object.keys(dashboardData.forexRates).length > 0 && (
                <Card className="flex flex-col">
                    <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Forex Rates</span>
                    </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 max-h-64 overflow-y-auto scrollbar-hide">
                    <div className="space-y-3">
                        {Object.entries(dashboardData.forexRates).map(([pair, data]: [string, any]) => (
                        <div key={pair} className="flex justify-between items-center py-2">
                            <span className="font-medium text-sm">{pair}</span>
                            <div className="text-right">
                            <div className="text-sm font-mono">{data.price?.toFixed(4)}</div>
                            <div className={`text-xs ${data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {data.changePercent >= 0 ? '+' : ''}{data.changePercent?.toFixed(2)}%
                            </div>
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

export default ForexRates
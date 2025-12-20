import StatCard from "@/components/ui/trending-dash/dash-block";
import { cardsData } from "../cardConstant"
import { useStockDashboard } from "../hooks/useStockDashboardContext"

export const TrendingCards = () => {
    const { data } = useStockDashboard();
    return(
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            { cardsData(data).map((item:any) => (
            <StatCard title={item.title} icon={item.icon} value={item.value} description={item.description} />
            ))}
         </div>
    )
}
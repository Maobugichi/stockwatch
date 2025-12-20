import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsContent } from "@/components/ui/tabs"
import { useStockDashboard } from "../hooks/useStockDashboardContext"
import StockCard from "@/components/ui/trending-dash/stock-card"
import { Link } from "react-router-dom"
import type{ LucideIcon } from "lucide-react"

interface ContentProps {
    value: string;
    title: string;
    description: string;
    data: any[];
    icon?: LucideIcon;
    iconClassName?: string;
    titleClassName?: string;
    showVolume?: boolean;
    showMarketCap?: boolean;
}

export const Content = ({
    value,
    title, 
    description, 
    data, 
    titleClassName,
    showVolume = false,
    showMarketCap = false
}: ContentProps) => {
    const { setSelectedStock } = useStockDashboard();
    
    return (
        <TabsContent value={value} className="space-y-6">
            <Card className='border-none shadow-none'>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-xl md:text-2xl ${titleClassName || ''}`}>
                        
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className='p-3'>
                    <ScrollArea className="h-screen md:h-96 w-full px-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            {data?.map((stock: any, index: number) => (
                                <Link key={index} to={`/watchlist/${stock.symbol}`}>
                                    <StockCard 
                                        stock={stock} 
                                        showMarketCap={showMarketCap}
                                        showVolume={showVolume}
                                        onSelect={setSelectedStock}
                                    />
                                </Link>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
import { Tabs } from '@/components/ui/tabs';
import Header from '@/components/ui/trending-dash/header';
import TabsListComponent from '@/components/ui/trending-dash/tabs-list';
import { ClipLoader } from 'react-spinners';
import { useStockDashboard } from '@/components/features/dashboard/hooks/useStockDashboardContext';
import { TrendingCards } from '@/components/features/dashboard/tabs/TrendingCards';
import { Content } from "@/components/features/dashboard/tabs/content"
import { tabsConfig } from '@/components/features/dashboard/constants';



const StockDashboard = () => {
    const { activeTab, isLoading, setActiveTab, data , isError , error } = useStockDashboard();

    if (isLoading) return <div className='h-screen grid place-items-center'><ClipLoader size={40}/></div>

    if (isError) return <div className='h-screen grid place-items-center'>{error}</div>

    return (
        <div className="h-auto min-h-[150vh] md:min-h-screen overflow-hidden  font-inter space-y-6 font-semibold">
            <Header/>
            <div className="overflow-auto mx-auto px-6 ">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 bg-[#06070B]">
                   
                    <TrendingCards/>
                    <TabsListComponent value={activeTab}/>
                    {tabsConfig.map((config) => (
                        <Content
                            key={config.value}
                            value={config.value}
                            title={config.title}
                            description={config.description}
                            data={data?.[config.dataKey] || []}
                            icon={config.icon}
                            iconClassName={config.iconClassName}
                            titleClassName={config.titleClassName}
                            showVolume={config.showVolume}
                            showMarketCap={config.showMarketCap}
                        />
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default StockDashboard;
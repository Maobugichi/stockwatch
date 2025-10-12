import  {  useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  FlameIcon,
} from 'lucide-react';
import type { UserChoiceTypeWatch } from '@/types';
import { redirect } from 'react-router-dom';
import NewsItem from '@/components/ui/trending-dash/news';
import StockCard from '@/components/ui/trending-dash/stock-card';
import Header from '@/components/ui/trending-dash/header';
import StatCard from '@/components/ui/trending-dash/dash-block';
import TabsListComponent from '@/components/ui/trending-dash/tabs-list';
import { useQuery  } from "@tanstack/react-query"
import { ClipLoader } from 'react-spinners';
import api from '@/lib/axios-config';
const StockDashboard = () => {
  const { data , isLoading , error ,  isError } = useQuery({queryKey:['port'], queryFn: async() => {
    const response = await api.get(`/api/trending-stock`)
    return response.data
  }});

  console.log(error)

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [ userChoice , setUserChoice ] = useState<UserChoiceTypeWatch>({
      ticker:"",             
  });
 
const [activeTab, setActiveTab] = useState("overview");
 
useEffect(() => {
  setRefreshing(false);console.log(selectedStock)
},[]);

if (isLoading) return <ClipLoader size={40}/>

if (isError) {
    redirect("/login")
}

const cardsData = (data: any) => [
  {
    title: "Live Data Points",
    icon: <DollarSign className="h-4 w-4" />,
    value: data?.liveData?.length || 0,
    description: "Real-time quotes",
    gradientClass: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
  {
    title: "Trending Stocks",
    icon: <TrendingUp className="h-4 w-4" />,
    value: data?.isTrendingQuote?.length || 0,
    description: "Popular today",
    gradientClass: "bg-gradient-to-br from-green-50 to-green-100",
  },
  {
    title: "Most Active",
    icon: <Activity className="h-4 w-4" />,
    value: data?.active?.length || 0,
    description: "High volume",
    gradientClass: "bg-gradient-to-br from-purple-50 to-purple-100",
  },
  {
    title: "News Items",
    icon: <Globe className="h-4 w-4" />,
    value:
      data?.news?.reduce((acc: any, item: any) => acc + (item.news?.length || 0), 0) || 0,
    description: "Latest updates",
    gradientClass: "bg-gradient-to-br from-orange-50 to-orange-100",
  },
];

  return (
    <div className="min-h-screen font-inter">
      <Header searchTerm={searchTerm} refreshing={refreshing} setSearchTerm={setSearchTerm} setUserChoice={setUserChoice} userChoice={userChoice}/>
    
      <div className="max-w-7xl overflow-auto mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsListComponent/>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              { cardsData(data).map((item:any) => (
                <StatCard title={item.title} icon={item.icon} value={item.value} description={item.description} gradientClass={item.gradientClass}/>
              ))}
            </div>

            <Card className='border-none shadow-none'>
              <CardHeader>
                <CardTitle className='text-xl md:text-2xl'>Live Market Data</CardTitle>
                <CardDescription>Real-time stock prices from your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {data?.liveData
                     .map((stock:any, index:any) => (
                        <StockCard 
                          key={index} 
                          stock={stock} 
                          showMarketCap 
                          onSelect={setSelectedStock}
                        />
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="trending">
            <Card className='border-none shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <FlameIcon className="text-orange-500 h-5 w-5" />
                  Trending Stocks
                </CardTitle>
                <CardDescription>Most popular stocks right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {data?.isTrendingQuote?.map((stock:any , index:number) => (
                    <StockCard key={index} stock={stock} onSelect={setSelectedStock} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

         
          <TabsContent value="gainers">
            <Card className='border-none shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-green-600">
                  <ArrowUpRight className="h-5 w-5" />
                  Top Gainers
                </CardTitle>
                <CardDescription>Stocks with the biggest gains today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.gainers?.map((stock:any, index:any) => (
                    <StockCard 
                      key={index} 
                      stock={stock} 
                      showVolume 
                      showMarketCap 
                      onSelect={setSelectedStock}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

         
          <TabsContent value="losers">
            <Card className='border-none shadow-none'>
              <CardHeader>
                <CardTitle className="flex text-xl md:text-2xl items-center gap-2 text-red-600">
                  <ArrowDownRight className="h-5 w-5" />
                  Top Losers
                </CardTitle>
                <CardDescription>Stocks with the biggest declines today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                  {data?.losers?.map((stock:any, index:any) => (
                    <StockCard 
                      key={index} 
                      stock={stock} 
                      showVolume 
                      showMarketCap 
                      onSelect={setSelectedStock}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        
          <TabsContent value="active">
            <Card className='border-none shadow-none'>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Most Active Stocks
                </CardTitle>
                <CardDescription>Stocks with the highest trading volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                  {data?.active?.map((stock:any, index:any) => (
                    <StockCard 
                      key={index} 
                      stock={stock} 
                      showVolume 
                      showMarketCap 
                      onSelect={setSelectedStock}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        
          <TabsContent value="news">
            <Card className='border-none shadow-none'>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Latest Market News
                </CardTitle>
                <CardDescription>Recent news for your stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {data?.news?.map((item:any, itemIndex:any) => 
                      item.news?.map((newsItem:any, newsIndex:any) => (
                        <NewsItem 
                          key={`${itemIndex}-${newsIndex}`} 
                          news={{ ...newsItem, symbol: item.symbol }}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockDashboard;
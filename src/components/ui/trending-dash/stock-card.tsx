import { Card, CardContent, CardHeader } from "../card";
import { Badge } from "../badge";
import { formatCurrency , formatVolume , formatMarketCap , getChangeColor } from "@/lib/utils";
import { Building2, Volume2,  Minus,  } from "lucide-react";
import ShimmerGradient from "@/components/common/shimmerGradient";
import { CaretDownIcon, CaretUpIcon , GlobeIcon } from "@phosphor-icons/react";






const getChangeIndicator = (change:any) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <CaretUpIcon weight="fill" size={16} className=" text-green-500" />;
    return <CaretDownIcon weight="fill" size={16} className=" text-red-500" />;
  };

interface StockCardProps {
  stock: any;
  showVolume?: boolean;
  showMarketCap?: boolean;
  onSelect?: (stock: any) => void;
}

const StockCard = ({ stock, showVolume = true, showMarketCap = true, onSelect }: StockCardProps) => {
  const isPositive = stock.changePercent > 0;
  
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 bg-[#14151C]/40 border border-[#14151C] h-[140px] rounded-3xl text-[rgb(252,252,252)] cursor-pointer shadow-none"
      onClick={() => onSelect && onSelect(stock)}
    >
     
      <ShimmerGradient 
       isPositive={isPositive} 
       changePercent={stock.changePercent} 
       />
      <CardHeader className="h-[35%] pb-2 pt-3 px-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
            className="text-xs font-semibold rounded-2xl bg-gray-900 text-white px-3 py-1 border-0 font-mono"
            >
              {stock.symbol}
            </Badge>
            {getChangeIndicator(stock.changePercent)}
          </div>
          
          <div className="text-right flex flex-col gap-0.5">
            <div className="font-bold text-lg leading-none">
              {formatCurrency(stock.price, stock?.currency)}
            </div>
            <div className={`text-xs font-semibold ${getChangeColor(stock.changePercent)}`}>
              {stock.changePercent ? `${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%` : 'N/A'}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-3 pt-0 h-[65%] flex flex-col justify-between">
        <div className="text-sm font-medium text-gray-700 truncate mb-1">
          {stock.name || stock.symbol}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500  gap-3">
          {showVolume && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Volume2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-mono font-medium truncate">{formatVolume(stock.volume)}</span>
            </div>
          )}
          
          {showMarketCap && (
            <div className="flex justify-end gap-1.5  flex-1 min-w-0">
              <Building2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-mono font-medium truncate">{formatMarketCap(stock.marketCap)}</span>
            </div>
          )}
          
          {stock.exchange && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <GlobeIcon weight="fill" size={16} className="text-blue-500" />
              <span className="font-medium">{stock.exchange.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard
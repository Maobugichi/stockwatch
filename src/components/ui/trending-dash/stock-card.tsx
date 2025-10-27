import { Card, CardContent, CardHeader } from "../card";
import { Badge } from "../badge";
import { formatCurrency , formatVolume , formatMarketCap , getChangeColor } from "@/lib/utils";
import { Building2, Volume2, Globe, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";






const getChangeIndicator = (change:any) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
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
      className="group relative overflow-hidden transition-all duration-300 h-[140px] rounded-3xl border cursor-pointer  shadow-sm hover:shadow-xl bg-white"
      onClick={() => onSelect && onSelect(stock)}
    >
     
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${
        isPositive 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
          : stock.changePercent < 0 
          ? 'bg-gradient-to-r from-red-500 to-rose-500'
          : 'bg-gradient-to-r from-gray-400 to-gray-500'
      }`} />
      
     
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
        isPositive ? 'bg-green-500' : stock.changePercent < 0 ? 'bg-red-500' : 'bg-gray-500'
      }`} />
      
      <CardHeader className="h-[35%] pb-2 pt-3 px-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs font-semibold rounded-lg bg-gray-900 text-white px-3 py-1 border-0 font-mono"
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
        
        <div className="flex items-center justify-between text-xs text-gray-500 gap-3">
          {showVolume && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Volume2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-mono font-medium truncate">{formatVolume(stock.volume)}</span>
            </div>
          )}
          
          {showMarketCap && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Building2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-mono font-medium truncate">{formatMarketCap(stock.marketCap)}</span>
            </div>
          )}
          
          {stock.exchange && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium">{stock.exchange.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard
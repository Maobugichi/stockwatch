import { Eye, TrendingUp } from "lucide-react";
const StockWatcherLogo = ({ size = 52 }) => (
    <div className="w-[10%]  grid place-items-center">
    <div className="relative w-fit">
    {/* Base eye icon */}
    <Eye 
      size={size} 
      className="text-white" 
      strokeWidth={1.5}
    />
    
   
    <TrendingUp 
      size={size * 0.4} 
      className="absolute -bottom-0.5 -right-0.5 text-green-500 bg-white rounded-full p-0.5" 
      strokeWidth={2}
    />
  </div>
    </div>
  
);



export {  StockWatcherLogo }
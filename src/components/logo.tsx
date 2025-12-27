import { Eye } from "lucide-react";
const StockWatcherLogo = ({ size = 40 }) => (
    <div className="w-[10%]  grid place-items-center">
    <Eye 
      size={size} 
      className="text-white" 
      strokeWidth={1.5}
    />
    </div>
  
);



export {  StockWatcherLogo }
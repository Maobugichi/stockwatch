import { Card, CardContent, CardHeader } from "../card";
import { Badge } from "../badge";
import { formatCurrency , formatVolume , formatMarketCap , getChangeColor } from "@/lib/utils";
import { Building2 , Volume2 , Globe , Minus , ArrowUpRight , ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const getChangeIndicator = (change:any) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

const StockCard = ({ stock, showVolume =true, showMarketCap = true, onSelect }:any) => {
      const [pathLength, setPathLength] = useState<number>(0);
      const [viewBox, setViewBox] = useState<string>("0 0 300 200"); 
      const pathRef = useRef<SVGPathElement>(null);
      const cardRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
            const calculatePathDimensions = () => {
            if (cardRef.current && pathRef.current) {
                const { width, height } = cardRef.current.getBoundingClientRect();
            
                setViewBox(`0 0 ${width} ${height}`);
                const length = pathRef.current.getTotalLength();
                
                setPathLength(length || 400); 
            }
            };
            const timeout = setTimeout(calculatePathDimensions, 100); // Increased delay
            window.addEventListener('resize', calculatePathDimensions);
            const interval = setInterval(calculatePathDimensions, 500); // Retry every 500ms
            return () => {
            clearTimeout(timeout);
            clearInterval(interval);
            window.removeEventListener('resize', calculatePathDimensions);
            };
  }, []);

  // Parse viewBox dimensions to numbers
  const viewBoxWidth = parseFloat(viewBox.split(' ')[2]);
  const viewBoxHeight = parseFloat(viewBox.split(' ')[3]);
  // Path for dynamic card size with rounded-2xl (16px radius), aligned to border
  const pathD = `M 0.5 16 A 16 16 0 0 1 16 0.5 H ${viewBoxWidth - 16} A 16 16 0 0 1 ${viewBoxWidth - 0} 16 V ${viewBoxHeight - 16} A 16 16 0 0 1 ${viewBoxWidth - 16} ${viewBoxHeight - 0} H 16 A 16 16 0 0 1 0.5 ${viewBoxHeight - 16} V 16 Z`;

   return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
     <div ref={cardRef} className="relative" >
        <Card 
        className=" transition-all h-[140px]  p-4 duration-200 cursor-pointer border-l-4 border-l-transparent "
        onClick={() => onSelect && onSelect(stock)}
        >
            <svg
                className="absolute inset-0 pointer-events-none z-20"
                width="100%"
                height="100%"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: 'translate(0.5px, 0.5px)' }}
            >
                <defs>
                {/* Glow filter for subtle neon effect */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Gradient for subtle purple-silver-pink transition */}
                <motion.linearGradient
                    id="neonGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                    animate={{
                    x1: ["0%", "100%", "0%"],
                    y1: ["0%", "100%", "0%"],
                    x2: ["100%", "0%", "100%"],
                    y2: ["100%", "0%", "100%"],
                    }}
                    transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    }}
                >
                    <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.4" />
                    <stop offset="30%" stopColor="var(--neon-silver)" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="var(--neon-pink)" stopOpacity="0.6" />
                </motion.linearGradient>
                </defs>
            
                <path ref={pathRef} d={pathD} fill="none" stroke="none" />
                {/* Animated neon trail path */}
                <motion.path
                key={pathLength + viewBox}
                d={pathD}
                fill="none"
                stroke="url(#neonGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#glow)"
                className="drop-shadow-[0_0_3px_var(--neon-glow)]"
                style={{
                    strokeDasharray: pathLength > 0 ? `${pathLength / 4} ${pathLength * 3 / 4}` : '100 300',
                
                }}
                animate={{
                    strokeDashoffset: [0, -pathLength || -400],
                }}
                transition={{
                    duration: 3,
                    ease: 'linear',
                    repeat: Infinity,
                }}
                />

             
            </svg>
        <CardHeader className="h-[30%] p-0">
            <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 h-full">
                <Badge variant="outline" className="text-[10px] md:text-xs rounded-full bg-black text-white pl-3 pr-3 font-mono">
                {stock.symbol}
                </Badge>
                {getChangeIndicator(stock.changePercent)}
            </div>
            <div className="text-right font-jet h-full flex flex-col  md:gap-0 gap-3">
                <div className="font-bold text-md md:text-lg ">
                {formatCurrency(stock.price, stock?.currency)}
                </div>
                <div className={`text-[9px] md:text-sm ${getChangeColor(stock.changePercent)}`}>
                {stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : 'N/A'}
                </div>
            </div>
            </div>
        </CardHeader>
        <CardContent className="p-0 h-[70%] grid">
            <div className="text-sm text-gray-600 mb-2 truncate">
            {stock.name || stock.symbol}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
            {showVolume && (
                <span className="font-jet flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                {formatVolume(stock.volume)}
                </span>
            )}
            {showMarketCap && (
                <span className="font-jet flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {formatMarketCap(stock.marketCap)}
                </span>
            )}
            {stock.exchange && (
                <span className="flex items-center gap-1">
                <Globe className="h-3 text-blue-600 w-4" />
                {stock.exchange.split(' ')[0]}
                </span>
            )}
            </div>
        </CardContent>
        </Card>
    </div>
   </motion.div> 
  )};  


export default StockCard
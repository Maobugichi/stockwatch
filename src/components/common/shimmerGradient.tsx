import { motion } from "motion/react";

interface ShimmerGradientProps {
  isPositive: boolean;
  changePercent: number;
}

const ShimmerGradient = ({ isPositive, changePercent }: ShimmerGradientProps) => {
  const gradientClass = isPositive 
    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
    : changePercent < 0 
    ? 'bg-gradient-to-r from-red-500 to-rose-500'
    : 'bg-gradient-to-r from-gray-400 to-gray-500';

  

  return (
    <>
   
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${gradientClass} overflow-hidden`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
    
    
    </>
  );
};

export default ShimmerGradient;
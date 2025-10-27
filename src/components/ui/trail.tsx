import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";


const Trail = () => {
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
    return(
          <svg
                className="absolute inset-0 pointer-events-none z-20"
                width="100%"
                height="100%"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: 'translate(0.5px, 0.5px)' }}
            >
                <defs>
              
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
    )
}

export default Trail
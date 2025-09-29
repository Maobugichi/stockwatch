import React, { useRef, useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const NeonTrailCard = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Calculate path length on mount and ensure it updates
  useEffect(() => {
    const calculatePathLength = () => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        console.log('Path Length:', length); // Debug log
        setPathLength(length || 960); // Fallback length (approx. for 320x192 rect with radius 10)
      }
    };
    // Delay to ensure SVG is rendered
    const timeout = setTimeout(calculatePathLength, 0);
    window.addEventListener('resize', calculatePathLength);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculatePathLength);
    };
  }, []);

  // Variants for the chase animation
  const trailVariants: Variants = {
    animate: {
      strokeDashoffset: [0, -pathLength],
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  // Path aligned to Card's outer border (320x192px, border-radius: 0.625rem = 10px)
  const pathD = "M 1 10 A 10 10 0 0 1 11 1 H 309 A 10 10 0 0 1 319 11 V 181 A 10 10 0 0 1 309 191 H 11 A 10 10 0 0 1 1 181 V 10 Z";

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="relative w-80 h-48">
        <Card className="w-full h-full rounded-lg bg-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-card-foreground">
              Neon Trail Card
            </h2>
            <p className="text-card-foreground">
              A cinematic neon trail effect around a shadcn Card.
            </p>
          </CardContent>
        </Card>
        {/* SVG for neon trail animation */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox="0 0 320 192"
          preserveAspectRatio="xMidYMid meet"
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
            {/* Gradient for color transition */}
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity="1" />
              <stop offset="50%" stopColor="var(--neon-purple)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--neon-pink)" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {/* Invisible path for length calculation */}
          <path ref={pathRef} d={pathD} fill="none" stroke="none" />
          {/* Animated neon trail path */}
          <motion.path
            key={pathLength} // Force re-render on pathLength change
            d={pathD}
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="1"
            strokeLinecap="round"
            filter="url(#glow)"
            className="drop-shadow-[0_0_2px_var(--neon-glow)]"
            style={{
              strokeDasharray: pathLength > 0 ? `${pathLength / 4} ${pathLength * 3 / 4}` : '240 720',
            }}
            animate={{
              strokeDashoffset: [0, -pathLength || -960],
            }}
            transition={{
              duration: 2,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default NeonTrailCard;
import { Eye, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";

interface TabsListComponentProps {
  value?: string;
}

const TabsListComponent = ({ value }: TabsListComponentProps) => {
  const [activeTab, setActiveTab] = useState(value || "overview");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    if (value) {
      setActiveTab(value);
    }
  }, [value]);

  useEffect(() => {
    
    const updateIndicator = () => {
      const activeElement = tabsRef.current[activeTab];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    };

    requestAnimationFrame(updateIndicator);
  }, [activeTab]);

  const tabs = [
    { value: "overview", icon: Eye, label: "Overview" },
    { value: "trending", icon: TrendingUp, label: "Trending" },
    { value: "gainers", icon: ArrowUpRight, label: "Gainers" },
    { value: "losers", icon: ArrowDownRight, label: "Losers" },
    { value: "active", icon: Activity, label: "Most Active" },
  ];

  return (
    <TabsList className="w-full overflow-x-auto scrollbar-hide flex justify-start lg:w-auto pl-2 border border-[rgb(34,36,45)] lg:justify-center bg-[#06070B] rounded-2xl relative">
    
      <motion.div
        className="absolute rounded-2xl border border-[#526FFF] bg-[#526FFF]/10   z-0"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        style={{
          height: "calc(100% - 8px)",
          top: "4px",
        }}
      />

      {tabs.map(({ value: tabValue, icon: Icon, label }) => (
        <TabsTrigger
          key={tabValue}
          value={tabValue}
          ref={(el) => {
            tabsRef.current[tabValue] = el;
          }}
          onClick={() => setActiveTab(tabValue)}
          className="flex-shrink-0 rounded-2xl flex items-center gap-1 text-xs whitespace-nowrap px-4 relative z-10 data-[state=active]:text-[#526FFF] text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
        >
          <Icon className="h-3 w-3" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabsListComponent;
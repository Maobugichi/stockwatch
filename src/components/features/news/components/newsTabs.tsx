import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  useRef } from "react";
import { 
  NewspaperIcon,
  CurrencyBtcIcon,
  CurrencyCircleDollarIcon,
  HandshakeIcon,
  MegaphoneIcon,
  BuildingApartmentIcon
} from "@phosphor-icons/react";



export const NewsTabs = () => {

  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabs = [
    { value: "general", icon: NewspaperIcon, label: "General" },
    { value: "crypto", icon: CurrencyBtcIcon, label: "Crypto" },
    { value: "forex", icon: CurrencyCircleDollarIcon, label: "Forex" },
    { value: "merger", icon: HandshakeIcon, label: "Mergers" },
    { value: "pressRelease", icon: MegaphoneIcon, label: "Press Releases" },
    { value: "company", icon: BuildingApartmentIcon, label: "Company" },
  ];

  return (
    <TabsList className="mb-6 bg-transparent border border-[rgba(34,36,45,0.5)]  h-10 md:h-12 z-30 w-full overflow-x-auto rounded-2xl scrollbar-hide flex justify-start lg:w-auto lg:justify-center top-0 relative snap-x snap-mandatory scroll-smooth gap-1 md:gap-2">
     

      {tabs.map(({ value: tabValue, icon: Icon, label }) => (
        <TabsTrigger
          key={tabValue}
          value={tabValue}
          ref={(el) => {
            tabsRef.current[tabValue] = el;
          }}
          className="flex-shrink-0 rounded-xl flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap px-3 md:px-4 relative z-10 data-[state=active]:border-[#526FFF]  data-[state=active]:text-[#526FFF] data-[state=active]:bg-[#526FFF]/10   text-muted-foreground  data-[state=active]:shadow-none transition-none snap-start"
        >
          <Icon size={16} weight="duotone" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
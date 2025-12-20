
import { GlobeIcon, FireIcon, RocketIcon, BroadcastIcon } from "@phosphor-icons/react"


export const cardsData = (data: any) => [
  {
    title: "Live Data Points",
    icon: <BroadcastIcon size={28} weight="fill" className="text-blue-600" />,
    value: data?.liveData?.length || 0,
    description: "Real-time quotes",
    gradientClass: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
   {
    title: "Trending Stocks",
    icon: <FireIcon size={28} weight='fill' className="text-orange-600" />,
    value: data?.isTrendingQuote?.length || 0,
    description: "Popular today",
    gradientClass: "bg-gradient-to-br from-green-50 to-green-100",
  },
  {
    title: "Top Gainers",
    icon: <GlobeIcon size={28} weight='fill' className=" text-emerald-600" />,
    value: data?.gainers?.length || 0,
    description: "Latest updates",
    gradientClass: "bg-gradient-to-br from-orange-50 to-orange-100",
  },
  {
    title: "Most Active",
    icon: <RocketIcon size={28} weight='fill' className="text-amber-600" />,
    value: data?.active?.length || 0,
    description: "High volume",
    gradientClass: "bg-gradient-to-br from-purple-50 to-purple-100",
  },
];

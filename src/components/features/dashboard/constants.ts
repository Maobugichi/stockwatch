import { 
    FlameIcon,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

export const tabsConfig = [
    {
        value: 'overview',
        title: 'Live Market Data',
        description: 'Real-time stock prices from your portfolio',
        dataKey: 'liveData',
        showMarketCap: true,
    },
    {
        value: 'trending',
        title: 'Trending Stocks',
        description: 'Most popular stocks right now',
        dataKey: 'isTrendingQuote',
        icon: FlameIcon,
        iconClassName: 'text-orange-500',
    },
    {
        value: 'gainers',
        title: 'Top Gainers',
        description: 'Stocks with the biggest gains today',
        dataKey: 'gainers',
        icon: ArrowUpRight,
        titleClassName: 'text-green-600',
        showVolume: true,
        showMarketCap: true,
    },
    {
        value: 'losers',
        title: 'Top Losers',
        description: 'Stocks with the biggest declines today',
        dataKey: 'losers',
        icon: ArrowDownRight,
        titleClassName: 'text-red-600',
        showVolume: true,
        showMarketCap: true,
    },
    {
        value: 'active',
        title: 'Most Active Stocks',
        description: 'Stocks with the highest trading volume',
        dataKey: 'active',
        icon: Activity,
        showVolume: true,
        showMarketCap: true,
    },
];
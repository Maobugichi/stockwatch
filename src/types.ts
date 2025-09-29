type StockData = {

  symbol: string
  company_name: string
  currency: string
  sector: string
  industry: string
  employees: number
  headquarters: string
  website: string
  business_summary: string

  
  current_price: number
  change_percent_daily: number
  market_cap: number
  open: number
  prev_close: number
  day_high: number
  day_low: number
  fifty_two_week_high: number
  fifty_two_week_low: number
  ohlc_history: { date: string; open: number; high: number; low: number; close: number; volume: number }[]

  volume: number
  avg_volume: number
  avg_volume_3m: number
  avg_volume_10d: number
  volume_history: { date: string; volume: number }[]

  pe_ratio: number
  peg_ratio: number
  price_to_book: number
  price_to_sales: number
  beta: number
  enterprise_value: number
  shares_outstanding: number


  revenue: number
  net_income: number
  eps: number
  profit_margins: number
  gross_margins: number
  operating_margins: number
  free_cashflow: number
  operating_cashflow: number
  book_value: number
  ebitda: number
  debt_to_equity: number
  return_on_equity: number
  return_on_assets: number


  dividend_rate: number
  dividend_yield: number
  payout_ratio: number
  next_dividend_date: string


  analyst_target_mean: number
  analyst_target_high: number
  analyst_target_low: number
  recommendation_mean: number
  recommendations: {
    period: string
    strongBuy: number
    buy: number
    hold: number
    sell: number
    strongSell: number
  }[]

 
  earnings_yearly: { date: string; revenue: number; earnings: number }[]
  earnings_quarterly: { date: string; revenue: number; earnings: number }[]
  earnings_estimates: { date: string; actual: number; estimate: number }[]
  next_earnings_date: string
}

type TimePeriod  = {
  timePeriod?: string;
}

type PortfolioData = {
  portfolioValue: number
  investedAmount: number
  profitLoss: number
  percentGainLoss: number
  dailyChange: number
  dailyChangePercent: number,
  profitLossHistory:[],
  marketBenchmarkPercent:number;
  dailyHistory:any
  low52:any
  high52:any,
  topStock:any,
  worstStock:any,
  breakdown: {
    symbol: string
    shares: string
    buyPrice: string
    currentPrice: number
    prevClose: number
    fiftyTwoWeekHigh?: number
    fiftyTwoWeekLow?: number
    marketCap?: number
    peRatio?: number
    dividendYield?: number
   
  }[]
}

interface DashboardData {
  currency: string;
  marketIndices: any[];
  trendingStocks: any[];
  topGainers: any[];
  topLosers: any[];
  mostActive: any[];
  news: Record<string, any[]>;
  sectorMovers: Record<string, {
    [sectorName: string]: {
      avgChangePercent: number;
      totalMarketCap: number;
      stocks: any[];
      topPerformer: any;
    }
  }>;
  ipos: any[];
  forexRates: Record<string, {
    price: number;
    change: number;
    changePercent: number;
  }>;
  crypto: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    sparkline: any[];
    sparklineChangePercent: number;
  }>;
  earningsCalendar: any[];
  economicIndicators: any[];
}


 interface LiveData {
  symbol: string;
  price: number | null;
  change: number | null;
  percentChange: number | null;
  marketCap: number | null;
  currency: string | null;
  exchange: string | null;
}

 interface SimpleStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

interface ExtendedStock extends SimpleStock {
  volume: number;
  marketCap: number;
}

 interface NewsItem {
  title: string;
  publisher: string;
  link: string;
  published: number;
  symbol: string;
}

 interface NewsResponse {
  symbol: string;
  validQuotes: { symbol: string; shortName?: string; quoteType?: string }[];
  news: Omit<NewsItem, "symbol">[];
}

 interface StockApiResponse {
  liveData: LiveData[];
  trending: SimpleStock[];
  gainers: ExtendedStock[];
  losers: ExtendedStock[];
  active: ExtendedStock[];
  trendin: SimpleStock[];
  news: NewsResponse[];
}

type UserChoiceType = {
    ticker:string,
    shares:string,
    buyPrice:string
}

type UserChoiceTypeWatch = {
    ticker:string,
}


export type { StockData , TimePeriod, PortfolioData , DashboardData , LiveData , SimpleStock ,ExtendedStock , NewsItem, NewsResponse , StockApiResponse , UserChoiceType , UserChoiceTypeWatch }
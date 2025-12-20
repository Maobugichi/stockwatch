export interface Stock {
  symbol: string;
  company_name: string;
  current_price: number | null;
  change_percent_daily: number | null;
  market_cap: number | null;
  pe_ratio: number | null;
  volume: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low: number | null;
  sparkline: {
    timestamps: string[];
    closes: number[];
  };
}

export interface UserChoiceTypeWatch {
  ticker: string;
}

export interface DeleteDialogType {
    open: boolean;
    symbol: string | null;
}
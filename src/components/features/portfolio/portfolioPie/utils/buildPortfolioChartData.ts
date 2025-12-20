type BreakdownItem = {
  symbol: string;
  shares: number | string;
  currentPrice: number;
};

export function buildPortfolioChartData(breakdown: BreakdownItem[]) {
  const totalValue = breakdown.reduce(
    (sum, item) => sum + Number(item.shares) * item.currentPrice,
    0
  );

  const chartData = breakdown.map(item => {
    const value = Number(item.shares) * item.currentPrice;
    const percentage = ((value / totalValue) * 100).toFixed(1);

    return {
      name: item.symbol,
      value,
      percentage,
      displayValue: `$${value.toLocaleString()}`,
    };
  });

  return { chartData, totalValue };
}

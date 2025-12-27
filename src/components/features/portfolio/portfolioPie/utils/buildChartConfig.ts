import { type ChartConfig } from "@/components/ui/chart";
import { chartColors } from "./resolveCssVar";

export function buildChartConfig<T extends { symbol: string }>(
  breakdown: T[]
): ChartConfig {
  return Object.fromEntries(
    breakdown.map((item, index) => [
      item.symbol,
      {
        label: item.symbol,
        color: chartColors[index % chartColors.length],
      },
    ])
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const AVAILABLE_MARKETS = ["US", "NG", "GB", "DE", "FR", "JP"];

export default function StepPreferredMarkets({ next, data }: any) {
  const [markets, setMarkets] = useState<string[]>(data.preferredMarkets || []);

  const toggleMarket = (market: string) => {
    if (markets.includes(market)) {
      setMarkets(markets.filter((m) => m !== market));
    } else {
      setMarkets([...markets, market]);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Choose your preferred markets</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {AVAILABLE_MARKETS.map((market) => (
          <label key={market} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={markets.includes(market)}
              onCheckedChange={() => toggleMarket(market)}
            />
            {market}
          </label>
        ))}
      </div>

      <Button
        className="mt-6"
        onClick={() => next({ preferredMarkets: markets })}
        disabled={markets.length === 0}
      >
        Continue
      </Button>
    </div>
  );
}
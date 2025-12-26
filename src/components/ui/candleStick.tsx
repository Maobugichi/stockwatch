import { useEffect, useRef, type SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimePeriodDropdown from "./chart_drop";
import { createChart } from "lightweight-charts";
import {
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  CandlestickSeries,
} from "lightweight-charts";

interface CandleProp {
  stock?: {
    ohlc_history: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
    }>;
  };
  timePeriod: string;
  setSelectedTimePeriod: React.Dispatch<SetStateAction<string>>;
}

const Candlestick: React.FC<CandleProp> = ({
  stock,
  timePeriod,
  setSelectedTimePeriod,
}) => {
  const candleChartContainer = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const getBarSpacing = () => {
    if (!stock?.ohlc_history) return 6;

    const dataLength = stock.ohlc_history.length;
    const containerWidth = candleChartContainer.current?.clientWidth || 800;
    const minCandleWidth = 10;

    const idealSpacing = Math.max(containerWidth / dataLength, minCandleWidth);

    const baseSpacing = {
      "1m": 15,
      "5m": 8,
      "15m": 7,
      "1h": 6,
      "4h": 5,
      "1d": 35,
      "1w": 3,
      "1M": 3,
    }[timePeriod || "1d"] || 6;

    return Math.min(Math.max(idealSpacing, baseSpacing), 50);
  };

  useEffect(() => {
    if (!candleChartContainer.current || !stock?.ohlc_history) return;

    const container = candleChartContainer.current;

    const chart = createChart(container, {
      layout: {
        background: { color: "transparent" },
        textColor: "#333",
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
      },
      grid: {
        vertLines: { color: "rgb(34,36,45)" },
        horzLines: { color: "rgb(34,36,45)" },
      },
      width: container.clientWidth,
      height: Math.max(container.clientHeight - 10, 300), // Ensure minimum height and account for padding
      timeScale: {
        borderColor: "#cccccc",
        timeVisible: true,
        secondsVisible: timePeriod?.includes("m") || timePeriod?.includes("s"),
        rightOffset: 5,
        barSpacing: getBarSpacing(),
        minBarSpacing: 5,
        fixLeftEdge: true,
        fixRightEdge: false,
      },
      rightPriceScale: {
        borderColor: "#cccccc",
        scaleMargins: {
          top: 0.1,
          bottom: 0.15, 
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

    const candlestickData: CandlestickData[] = stock.ohlc_history
      .filter(
        (item) =>
          item &&
          item.date &&
          !isNaN(item.open) &&
          !isNaN(item.high) &&
          !isNaN(item.low) &&
          !isNaN(item.close)
      )
      .map((item, i) => {
        let time: any = Math.floor(new Date(item.date).getTime() / 1000);
        time += i * 60;

        if (typeof item.date === "string") {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            time = Math.floor(dateObj.getTime() / 1000);
            time += i * 0.0001;
          }
        }

        return {
          time,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        };
      })
      .sort((a, b) => a.time - b.time);

    if (candlestickData.length > 0) {
      candlestickSeries.setData(candlestickData);
    }

    chartInstance.current = chart;
    candleSeries.current = candlestickSeries;

    const handleResize = () => {
      if (candleChartContainer.current && chartInstance.current) {
        const newHeight = Math.max(container.clientHeight - 10, 300);
        chartInstance.current.applyOptions({
          width: container.clientWidth,
          height: newHeight,
          timeScale: { barSpacing: getBarSpacing() },
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
        candleSeries.current = null;
      }
    };
  }, [stock, timePeriod]);

  return (
    <Card className="bg-[#14151C] border border-[rgba(34,36,45,0.5)] text-white rounded-3xl w-full max-w-full overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg">Price Chart (OHLC)</CardTitle>
          <TimePeriodDropdown
            period={timePeriod}
            setPeriod={setSelectedTimePeriod}
          />
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6 flex-1 flex flex-col min-h-0">
        <div
          ref={candleChartContainer}
          className="w-full flex-1 min-h-[300px] rounded  bg-[#14151C] border border-[rgb(34,36,45)] "
        />
      </CardContent>
    </Card>
  );
};

export default Candlestick;
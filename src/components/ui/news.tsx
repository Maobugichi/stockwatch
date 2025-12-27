import useNews from "@/hooks/useNews";
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { handleAnalyze } from "@/lib/utils";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";

interface StockNewsProps {
  marketContext?: string;
}

interface SentimentAnalysis {
  score: number;
  normalizedScore: number;
  sentiment: string;
  strength: number;
  confidence: number;
  positive: string[];
  negative: string[];
  wordCount: number;
  marketContext?: string;
  timeWeight?: number;
  breakdown?: {
    baseScore: number;
    financeAdjustment: number;
    contextMultiplier: number;
    balanceScore: number;
  };
}

const StockNews: React.FC<StockNewsProps> = ({  marketContext = 'neutral' }) => {
  const { news, loading, isError } = useNews();

  const [index, setIndex] = useState(0);
  const [sentiment, setSentiment] = useState<null | SentimentAnalysis>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (!news || news.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length);
      setSentiment(null);
    }, 5000);

    return () => clearInterval(interval);
  }, [news]);

    if (loading) {
    return (
      <div className="mt-2 animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  

  if (isError) {
     return <p className="text-sm text-gray-500">No news available.</p>;
  }

  if (!news || news.length === 0) {
    return <p className="text-sm text-gray-500">No news available.</p>;
  }

  

  const article: any = news[index];


  const getSentimentDisplay = () => {
    if (!sentiment) return null;

    const { sentiment: label, strength, confidence } = sentiment;
    
    let icon, colorClass, bgClass;
    
    switch (label) {
      case "Very Bullish":
        icon = <TrendingUp className="h-3 w-3" />;
        colorClass = "text-green-700";
        bgClass = "bg-green-100";
        break;
      case "Bullish":
        icon = <TrendingUp className="h-3 w-3" />;
        colorClass = "text-green-600";
        bgClass = "bg-green-50";
        break;
      case "Very Bearish":
        icon = <TrendingDown className="h-3 w-3" />;
        colorClass = "text-red-700";
        bgClass = "bg-red-100";
        break;
      case "Bearish":
        icon = <TrendingDown className="h-3 w-3" />;
        colorClass = "text-red-600";
        bgClass = "bg-red-50";
        break;
      default:
        icon = <Minus className="h-3 w-3" />;
        colorClass = "text-gray-600";
        bgClass = "bg-gray-100";
    }

    return { icon, colorClass, bgClass, label, strength, confidence };
  };

  const sentimentDisplay = getSentimentDisplay();

  return (
    <div className="border border-[rgba(34,36,45,0.5)] relative h-24 md:h-32 w-full overflow-hidden rounded-3xl px-5 font-space-grotesk tracking-wide ">
      <AnimatePresence mode="wait">
        <motion.div
          key={article.uuid}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-[#14151C] rounded-2xl shadow-md border-none px-4 sm:p-3 flex items-center gap-5 sm:gap-3 "
        >
          {article.thumbnail ?  (
            <img
              src={article.thumbnail}
              alt=""
              className="md:w-24 md:h-[90%] w-[25%] h-[80%] rounded-xl border object-cover flex-shrink-0"
            /> ):  <Skeleton className="md:w-24 md:h-[90%] w-[25%] h-[80%] rounded-xl border object-cover flex-shrink-0" />
          }

          <div className="flex-1 min-w-0 space-y-2">
            <h4 className="text-sm font-medium text-[rgb(252,252,252)] line-clamp-1 sm:line-clamp-2">
              {article.title}
              <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-70" />
            </h4>

            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-500">
              <span>{article.publisher}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.relativeTime}</span>
              </div>
            </div>

            {article.summary && (
              <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                {article.summary}
              </p>
            )}

           
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
              <button
                onClick={() => handleAnalyze(setAnalyzing, setSentiment, article, marketContext)}
                disabled={analyzing}
                className="text-[10px] sm:text-xs border border-[#526FFF] bg-[#526FFF]/10 text-[#526FFF] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md hover:bg-blue-200 transition disabled:opacity-50"
              >
                {analyzing ? "Analyzing..." : "AI Sentiment"}
              </button>

              {sentimentDisplay && (
                <span
                  className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 ${sentimentDisplay.bgClass} ${sentimentDisplay.colorClass}`}
                >
                  {sentimentDisplay.icon}
                  {sentimentDisplay.label}
                </span>
              )}

              {sentiment && (
                <div className="flex items-center gap-1">
                  <Progress
                    value={sentiment.strength}
                    className={`w-12 sm:w-16 h-1 rounded !bg-gray-200 ${
                      sentimentDisplay?.label.includes("Bullish")
                        ? "[&>div]:!bg-green-500" 
                        : sentimentDisplay?.label.includes("Bearish")
                        ? "[&>div]:!bg-red-500" 
                        : "[&>div]:!bg-gray-400"
                    }`}
                  />
                  <span className="text-[9px] sm:text-[10px] text-gray-500">
                    {sentiment.confidence}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

      );
};

export default StockNews;
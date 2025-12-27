import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface NewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number;
  summary: string;
  image: string | null;
  category: string;
  related?: string; 
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const NewsCard = ({ item }: { item: NewsItem }) => {
  const navigate = useNavigate();

  const handleTickerClick = (ticker: string) => {
    navigate(`/news/company?type=company&symbol=${ticker}&range=7d`);
  };

  return (
    <Card className="hover:shadow-md pt-0 rounded-3xl border border-[#14151C]a bg-[#14151C]/40 text-white transition h-full">
      <img
        src={item.image || "/placeholder-news.png"}
        alt={item.headline}
        className="rounded-t-3xl w-full object-cover"
        loading="lazy"
      />
      <CardHeader>
        <CardTitle className="text-base line-clamp-1">{item.headline}</CardTitle>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
          <span>{item.source}</span>
          <span>{formatDate(item.datetime)}</span>
        </div>
      </CardHeader>
      <CardContent className="text-sm grid space-y-5">
        <p className="text-xs text-blue-600 uppercase font-semibold">{item.category}</p>
        <p className="line-clamp-2">{item.summary}</p>
        {item.related && (
          <div className="flex flex-wrap gap-2 mt-2">
            {item.related.split(",").map((ticker) => (
              <Button
                key={ticker}
                className=""
                onClick={() => handleTickerClick(ticker)}
              >
                {ticker}
              </Button>
            ))}
          </div>
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mt-2 inline-block"
        >
          Read more
        </a>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
import { Card , CardContent  } from "../card";
import { Badge } from "../badge";
import { Clock } from "lucide-react";



const NewsItem = ({ news }:any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Badge variant="secondary" className="text-xs">
            {news.symbol}
          </Badge>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight mb-2 line-clamp-2">
              {news.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{news.publisher}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(news.published).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  export default NewsItem
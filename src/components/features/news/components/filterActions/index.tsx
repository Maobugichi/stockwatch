
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  Filter, 
  RefreshCw, 
  Clock, 
  TrendingUp,
} from "lucide-react"; 
 
 
 const RenderFiltersAndActions = ({sortBy, setSortBy,handleRefresh,refreshing,autoRefresh, setAutoRefresh}) => (
  <div className="mb-6 space-y-3">
   
    <div className="md:hidden space-y-3">
     
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
          <SelectTrigger className="flex-1 h-11">
            <Clock className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="relevance">Most Relevant</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="flex-1 h-11">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map(source => (
              <SelectItem key={source} value={source!}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

   
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 h-11"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button
          variant={autoRefresh ? "default" : "outline"}
          className="flex-1 h-11"
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Auto {autoRefresh ? 'ON' : 'OFF'}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600 py-2 bg-white rounded-lg border">
        Showing <span className="font-semibold">{paginatedNews.length}</span> of{' '}
        <span className="font-semibold">{processedNews.length}</span> articles
      </div>
    </div>

   
    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border shadow-sm">
    
      <div className="col-span-5 flex gap-3">
        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
          <SelectTrigger className="flex-1 h-10 bg-white">
            <Clock className="w-4 h-4 mr-2 text-gray-600" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Newest First
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Oldest First
              </div>
            </SelectItem>
            <SelectItem value="relevance">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Most Relevant
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="flex-1 h-10 bg-white">
            <Filter className="w-4 h-4 mr-2 text-gray-600" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map(source => (
              <SelectItem key={source} value={source!}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions Section - 4 columns */}
      <div className="col-span-4 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 h-10 bg-white hover:bg-gray-50"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden lg:inline">Refresh</span>
        </Button>

        <Button
          variant={autoRefresh ? "default" : "outline"}
          className={`flex-1 h-10 ${autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white hover:bg-gray-50'}`}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="hidden lg:inline">Auto</span>
          <span className="lg:hidden">{autoRefresh ? 'ON' : 'OFF'}</span>
          <span className="hidden lg:inline ml-1">{autoRefresh ? 'ON' : 'OFF'}</span>
        </Button>
      </div>

      {/* Article Count - 3 columns */}
      <div className="col-span-3 text-right">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{paginatedNews.length}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="font-semibold text-gray-900">{processedNews.length}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
);
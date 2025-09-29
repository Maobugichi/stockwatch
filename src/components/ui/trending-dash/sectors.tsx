import type { DashboardData } from "@/types";
import { Card } from "../card";
import { formatNumber } from "@/lib/utils";
import { Building2 } from "lucide-react";


interface SectorProps {
    dashboardData: DashboardData
}

const Sectors:React.FC<SectorProps> = ({ dashboardData }) => {
    return(
        <>
            {Object.entries(dashboardData.sectorMovers).map(([market, sectors]: [string, any]) => (
              <div key={market} className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700">{market} Market Sectors</h3>
                
                {Object.keys(sectors).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(sectors).map(([sectorName, sectorData]: [string, any]) => (
                      <Card key={sectorName} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-sm">{sectorName}</h4>
                            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                              sectorData.avgChangePercent >= 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {sectorData.avgChangePercent >= 0 ? '+' : ''}{sectorData.avgChangePercent?.toFixed(2)}%
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Market Cap: ${formatNumber(Number((sectorData.totalMarketCap / 1e12).toFixed(1)))}T
                          </div>
                          
                          {sectorData.topPerformer && (
                            <div className="border-t pt-2">
                              <div className="text-xs text-gray-600 mb-1">Top Performer:</div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium">{sectorData.topPerformer.symbol}</span>
                                <span className={`text-xs ${
                                  sectorData.topPerformer.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {sectorData.topPerformer.changePercent >= 0 ? '+' : ''}{sectorData.topPerformer.changePercent?.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Show sector stocks */}
                          {sectorData.stocks?.length > 0 && (
                            <div className="border-t pt-2">
                              <div className="text-xs text-gray-600 mb-2">Key Stocks:</div>
                              <div className="space-y-1">
                                {sectorData.stocks.slice(0, 3).map((stock: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="font-medium">{stock.symbol}</span>
                                    <span className={stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(1)}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No sector data available for {market}
                  </div>
                )}
              </div>
            ))}
        </>
    )
}

export default Sectors
import { Card } from "../card";
import { BarChart3 } from "lucide-react";

interface IndicatorProps {
    macroData:{name:any, date:string ,value:any, impact:any, index:number}[]
}


const Indicators:React.FC<IndicatorProps> = ({macroData}) => {
    console.log(macroData)
    return(
        <>
           {macroData.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold">Economic Indicators</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {macroData.slice(0, 4).map((indicator, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{indicator.name}</div>
                          <div className="text-sm text-gray-500">{indicator.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{indicator.value}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            indicator.impact === 'High' ? 'bg-red-100 text-red-700' :
                            indicator.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {indicator.impact}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
        </>
    )
}

export default Indicators
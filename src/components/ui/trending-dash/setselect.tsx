import type { DashboardData } from "@/types";
import { Button } from "../button";
import type { SetStateAction } from "react";

interface NewsProps {
    dashboardData: DashboardData;
    setSelectedNewsMarket:React.Dispatch<SetStateAction<any>>
}

const SetSelect:React.FC<NewsProps> = ({ dashboardData , setSelectedNewsMarket}) => {
    return(
        <div className="flex gap-2">
                {Object.keys(dashboardData.news).map((market) => (
                  <Button
                    key={market}
                    className=""
                    clicked={() => setSelectedNewsMarket(market)}
                  >
                    {market}
                  </Button>
                ))}
        </div>
    )
}

export default SetSelect
import Holdings from "@/components/holdings"
import type { UserChoiceTypeWatch } from "@/types";
import { Eye, PlusCircle } from "lucide-react"
import { useState } from "react";

export const WatchlistEmptyState = () => {
     const [openWatch, setOpenWatch] = useState<boolean>(false);
     const [userChoiceWatch, setUserChoiceWatch] = useState<UserChoiceTypeWatch>({
        ticker: ""
     });
    return(
         <div className="h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Eye size={40} className="text-gray-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                Your watchlist is empty
                </h2>
                <p className="text-gray-500">
                Start tracking stocks you're interested in by adding them to your watchlist
                </p>
            </div>
            <Holdings
                header={<PlusCircle size={20}/> }
                type="watchlist"
                open={openWatch}
                setOpen={setOpenWatch}
                userChoice={userChoiceWatch}
                setUserChoice={setUserChoiceWatch}
                buttonClass="bg-black w-[40%] mx-auto"
            />
            </div>
        </div>
    )
}
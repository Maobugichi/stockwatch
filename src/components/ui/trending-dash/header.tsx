import { Badge } from "../badge";
import { RefreshCw } from "lucide-react";
import { Button } from "../button"
import { type SetStateAction } from "react";
import ModernTickerSearch from "./search";

interface HeaderProps {
    searchTerm: string;
    refreshing: boolean;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    setUserChoice: any;
    userChoice: any
}

const Header: React.FC<HeaderProps> = ({ searchTerm, refreshing, setSearchTerm, setUserChoice }) => {
    return (
        <div className="bg-white border-b relative">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex md:flex-row flex-col justify-between gap-3 space-y-3">
                    <div className="flex w-full md:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Stock Dashboard</h1>
                        <Badge variant="outline" className="text-green-600">
                            Live Data
                        </Badge>
                    </div>

                    <div className="flex gap-2 w-full md:w-[60%]">
                        <ModernTickerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} setUserChoice={setUserChoice}/>

                        <Button
                            disabled={refreshing}
                            className=" h-10  "
                        >
                            <RefreshCw className={`h-4 w-4  ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="md:block hidden">Refresh</span> 
                        </Button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
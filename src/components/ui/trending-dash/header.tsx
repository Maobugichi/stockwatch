import { Badge } from "../badge";
import { RefreshCw, Search, Check, X, Building2 } from "lucide-react";
import { Button } from "../button"
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { getTicker } from "@/lib/utils";

interface HeaderProps {
    searchTerm: string;
    refreshing: boolean;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    setUserChoice: any;
    userChoice: any
}

const Header: React.FC<HeaderProps> = ({ searchTerm, refreshing, setSearchTerm, setUserChoice }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null); 
   
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!searchTerm.trim()) {
                setOptions([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            console.log("hello")
            try {
                await getTicker(searchTerm, setOptions);
              
            } catch (error) {
                console.error('Search error:', error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [searchTerm]);
    useEffect(() => {
        if (open && inputRef.current && document.activeElement !== inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [options, open]);

    const handleSelect = (item: any) => {
        setUserChoice((prev: any) => ({
            ...prev,
            ticker: item.symbol
        }));
        setSearchTerm(item.symbol + " - " + item.name);
        setOpen(false);
        setOptions([]);
    };

    const clearSelection = () => {
        setSearchTerm('');
        setUserChoice((prev: any) => ({
            ...prev,
            ticker: ''
        }));
        setOptions([]);
    };

    const handleClear = (e:any) => {

        e.stopPropagation();
        clearSelection();
            
    }

    return (
        <div className="bg-white border-b relative">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex md:flex-row flex-col  justify-between gap-3 space-y-3">
                    <div className="flex w-full md:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Stock Dashboard</h1>
                        <Badge variant="outline" className="text-green-600">
                            Live Data
                        </Badge>
                    </div>

                    <div className="md:w-[45%] w-full flex items-center ">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <div className="relative w-full">
                                    <Input
                                        ref={inputRef}
                                        placeholder="Search ticker (AAPL, TSLA, MSFT...)"
                                        value={searchTerm}
                                        type=""
                                        checkInput={(e:any) => {
                                            
                                         setSearchTerm(e.target.value);
                                         setOpen(true)
                                        }}
                                        autoComplete='off'
                                        name="search"
                                        className="pr-20 h-10"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                                        {searchTerm && (
                                            <button
                                               
                                                className="h-6 w-6 p-0 hover:bg-gray-100"
                                                onClick={handleClear}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                        {loading ? (
                                            <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                                        ) : (
                                            <Search className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-[--radix-popover-trigger-width] p-0"
                                align="start"
                                sideOffset={4}
                            >
                                {loading && (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                                        Searching...
                                    </div>
                                )}

                                {!loading && searchTerm && options.length === 0 && (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        No results found for "{searchTerm}"
                                    </div>
                                )}

                                {!loading && options.length > 0 && (
                                    <div className="max-h-60 overflow-auto">
                                        <div className="p-2 text-xs font-medium text-gray-500 border-b bg-gray-50">
                                            Found {options.length} result{options.length !== 1 ? 's' : ''}
                                        </div>
                                        {options.map((item: any) => (
                                            <div
                                                key={item.symbol}
                                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                                                onClick={() => handleSelect(item)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Building2 className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-semibold text-gray-900">
                                                            {item.symbol}
                                                        </div>
                                                        <div className="text-sm text-gray-500 truncate">
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Check className="h-4 w-4 text-transparent hover:text-gray-400" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!loading && !searchTerm && (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        Start typing to search for stocks...
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button
                        disabled={refreshing}
                        className="min-w-[100px] h-12 flex items-center"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
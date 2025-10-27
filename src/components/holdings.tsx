import React, { useState, type SetStateAction } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command"
import { handleUserChoice } from "@/lib/utils"
import { useContext } from "react";
import { MyContext } from "@/components/context";

import { useAddPortfolioHolding } from "@/hooks/usePortfolio"
import { useAddToWatchlist } from "@/hooks/useWatchList"
import { useDebouncedTickerSearch } from "@/hooks/useTickerSearch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface HoldingsProp {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    userChoice: any;
    setUserChoice: React.Dispatch<SetStateAction<any>>;
    type: "portfolio" | "watchlist"; 
    header: any;
}

const Holdings: React.FC<HoldingsProp> = ({ 
    open, 
    setOpen, 
    userChoice, 
    setUserChoice, 
    header, 
    type 
}) => {
    const myContext = useContext(MyContext);
    if (!myContext) throw new Error("MyContext must be used inside provider");
    
   
    const { setNotification } = myContext;
    const [query, setQuery] = useState("");
    
   
    const { data: options = [], isLoading: isSearching } = useDebouncedTickerSearch(query);
    
    // Mutation hooks
    const addHolding = useAddPortfolioHolding();
    const addToWatchlist = useAddToWatchlist();
    
    // Determine which mutation to use
    const isPortfolio = type === "portfolio";
    const isPending = isPortfolio ? addHolding.isPending : addToWatchlist.isPending;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!userChoice.ticker) {
            toast.error("Please select a stock");
            return;
        }

        if (isPortfolio) {
            if (!userChoice.shares || Number(userChoice.shares) <= 0) {
                toast.error("Please enter valid number of shares");
                return;
            }
            if (!userChoice.buyPrice || Number(userChoice.buyPrice) <= 0) {
                toast.error("Please enter valid buy price");
                return;
            }
        }

        try {
            if (isPortfolio) {
                await addHolding.mutateAsync(userChoice);
                
                setNotification({
                    message: `Successfully added ${userChoice.ticker} to portfolio`,
                    type: 'success'
                });
            } else {
              
                await addToWatchlist.mutateAsync(userChoice.ticker);  
                setNotification({
                    message: `Successfully added ${userChoice.ticker} to watchlist`,
                    type: 'success'
                });
            }

            // Reset form
            setQuery("");
            setUserChoice({
                ticker: "",
                shares: "",
                buyPrice: ""
            });

            // Close dialog after short delay
            setTimeout(() => {
                setOpen(false);
            }, 1500);

        } catch (err) {
            console.error("Failed to submit:", err);
            setNotification({
                message: `Failed to add ${userChoice.ticker}`,
                type: 'error'
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(prev => !prev)}>
                    {header}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isPortfolio ? "Add to Portfolio" : "Add to Watchlist"}
                    </DialogTitle>
                </DialogHeader>
                <form 
                    onSubmit={handleSubmit}
                    className="grid gap-4"
                >
                    <div>
                        <label htmlFor="stock">Stock</label>
                        <Command>
                            <CommandInput
                                placeholder="Search ticker (AAPL, TSLA, MSFT...)"
                                value={query}
                                onValueChange={setQuery}
                                disabled={isPending}
                            />
                            <CommandList>
                                {isSearching && (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            Searching...
                                        </span>
                                    </div>
                                )}
                                
                                {!isSearching && query && options.length === 0 && (
                                    <CommandEmpty>No tickers found</CommandEmpty>
                                )}
                                
                                {!isSearching && options.length > 0 && (
                                    <CommandGroup heading="Results">
                                        {options.map((item: any) => (
                                            <CommandItem
                                                key={item.symbol}
                                                value={`${item.symbol} ${item.name}`}
                                                onSelect={() => {
                                                    setUserChoice((prev: any) => ({
                                                        ...prev,
                                                        ticker: item.symbol
                                                    }));
                                                    setQuery(`${item.symbol} - ${item.name}`);
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{item.symbol}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </div>
                    
                    {/* Only show these fields for portfolio */}
                    {isPortfolio && (
                        <>
                            <div>
                                <label htmlFor="shares">Shares</label>
                                <Input
                                    name="shares"
                                    type="number"
                                    step="any"
                                    value={userChoice.shares}
                                    placeholder="e.g 10"
                                    onChange={(e) => handleUserChoice(e, setUserChoice)}
                                    disabled={isPending}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="buyPrice">Buy Price</label>
                                <Input
                                    name="buyPrice"
                                    type="number"
                                    step="0.01"
                                    value={userChoice.buyPrice}
                                    placeholder="e.g 120.50"
                                    onChange={(e) => handleUserChoice(e, setUserChoice)}
                                    disabled={isPending}
                                    required
                                />
                            </div>
                        </>
                    )}
                    
                    <Button 
                        type="submit" 
                        className="h-10 w-full bg-black text-white hover:bg-gray-800"
                        disabled={isPending || !userChoice.ticker}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isPortfolio ? "Adding to Portfolio..." : "Adding to Watchlist..."}
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Holdings
import React, { useEffect, useRef, useState, type SetStateAction } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getTicker, handleUserChoice } from "@/lib/utils"
import { useContext } from "react";
import { MyContext } from "@/components/context";

interface HoldingsProp {
    query: string,
    setQuery: React.Dispatch<SetStateAction<string>>,
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>,
    userChoice: any;
    setUserChoice: React.Dispatch<SetStateAction<any>>,
    submitDetails: (e: React.FormEvent<HTMLFormElement>, userChoice: any, userId: number, setUserChoice: any, setOpen: any, setQuery: any, setNotification: any) => void
    type: string
    header: any
}

const Holdings: React.FC<HoldingsProp> = ({ query, setQuery, open, setOpen, userChoice, setUserChoice, submitDetails, header, type }) => {
    const myContext = useContext(MyContext);
    if (!myContext) throw new Error("MyContext must be used inside provider");

    const { setNotification } = myContext;
    const [options, setOptions] = useState<any[]>([]);
    const userId = useRef<string>("");
    
    useEffect(() => {
        const delay = setTimeout(() => {
            if (!query) {
                setOptions([]);
                return;
            }
            getTicker(query, setOptions)
        }, 300);

        return () => clearTimeout(delay)
    }, [query])

    useEffect(() => {
        const data = localStorage.getItem("user-data");
        if (data) {
            const parsedData = JSON.parse(data)
            userId.current = parsedData.userId
        }
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(prev => !prev)} className="">{header}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type}</DialogTitle>
                </DialogHeader>
                <form 
                    onSubmit={(e) => submitDetails(e, userChoice, parseInt(userId.current), setUserChoice, setOpen, setQuery, setNotification)} 
                    className="grid gap-4"
                >
                    <div>
                        <label htmlFor="">Stock</label>
                        <Command>
                            <CommandInput
                                placeholder="Search ticker(AAPL , TSLA ,MSFT...)"
                                value={query}
                                onValueChange={(val) => {
                                    setQuery(val);
                                }}
                            />
                            <CommandList>
                                <CommandGroup heading="Items">
                                    {
                                        options.map((item: any) => (
                                            <CommandItem
                                                key={item.symbol}
                                                value={`${item.symbol} ${item.name}`}
                                                onSelect={() => {
                                                    setUserChoice((prev: any) => ({
                                                        ...prev,
                                                        ticker: item.symbol
                                                    }));
                                                    setQuery(item.symbol + " - " + item.name)
                                                    setOptions([])
                                                }}
                                            >
                                                {item.symbol} - {item.name}
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                    {type.includes('portfolio') && (
                        <div>
                            <label htmlFor="shares">Shares</label>
                            <Input
                                name="shares"
                                type="number"
                                value={userChoice.shares}
                                placeholder="e.g 10"
                                onChange={(e) => handleUserChoice(e, setUserChoice)}
                            />
                        </div>
                    )}
                    {type.includes('portfolio') && (
                        <div>
                            <label>Buy Price</label>
                            <Input
                                name="buyPrice"
                                type="number"
                                value={userChoice.buyPrice}
                                placeholder="e.g 120.50"
                                onChange={(e) => handleUserChoice(e, setUserChoice)}
                            />
                        </div>
                    )}
                    <Button type="submit" className="h-10 w-20 bg-black text-white">
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Holdings
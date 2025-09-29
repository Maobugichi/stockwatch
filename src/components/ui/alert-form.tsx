import { useEffect, useState , useContext } from "react";
import { MyContext } from "../context";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"

import { Input } from "./input";
import { Button } from "./button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { getTicker, handleAlerts } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form } from "./form";
import { BellPlus, Eye } from "lucide-react";

const CreateAlertForm = () => {
    const myContext = useContext(MyContext);
    if (!myContext) throw new Error("MyContext must be used inside provider");

    const { setNotification } = myContext;
    const [ query , setQuery ] = useState<string>("");
    const [ options, setOptions ] = useState<any>([])
    const [ conditions , setConditions ] = useState([
       { type:"price_above" , value:"" }
    ]);
    const [ open , setOpen ] = useState<boolean>(false)
    const [ userChoice, setUserChoice ] = useState<string>("") 

    const handleAddCondition = () => {
        setConditions([...conditions, {type:"price_above" , value:""}]);
    }

    const handleConditionChange = (
       index:number,
       key:string,
       value:string 
    ) => {
        const newConds:any = [...conditions]
        newConds[index][key] = value
        setConditions(newConds)
    }

    useEffect(() => {
     const delay = setTimeout(() => {
        if (!query) {
            setOptions([])
            return
        }
        getTicker(query,setOptions)
     }, 300);

     return () => clearTimeout(delay)
    },[query])

   return(
     <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
           <Button clicked={() => setOpen(prev => !prev)} className="" ><BellPlus size={20}/></Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>Create Stock Alert</DialogTitle>
            </DialogHeader>

            <Form submitForm={(e:React.FormEvent<HTMLFormElement>) => handleAlerts(e,query,conditions,setQuery,setConditions,setNotification)} className="">
                <Card className="shadow-none border-0">
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                        <Label htmlFor="symbol">Stock Symbol</Label>
                        </div>
                    </CardContent>
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
                                options.map((item:any) => (
                                    <CommandItem
                                    key={item.symbol}
                                    value={`${item.symbol} ${item.name}`}
                                    onSelect={() => {
                                        setUserChoice(item.symbol);
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
                </Card>

                {conditions.map((cond,i) => (
                    <div key={i} className="flex items-end justify-between  ">
                        <div className="flex h-20  flex-col justify-end gap-2">
                          <Label>Condition Type</Label>
                          <Select
                           value={cond.type}
                           
                           onValueChange={(value) => handleConditionChange(i , "type" , value)}
                          >
                            <SelectTrigger className="h-[500px]">
                                <SelectValue placeholder="Select condition"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="price_above">
                                    Price Above
                                </SelectItem>
                                <SelectItem value="price_below">Price Below</SelectItem>
                                <SelectItem value="volume_above">Volume Above</SelectItem>
                            </SelectContent>    
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="ml-3">Value</Label>
                          <Input
                           type="number"
                           name="Value"
                           value={cond.value}
                           className=" border"
                           placeholder="value"
                           checkInput={(e:React.ChangeEvent<HTMLInputElement>) => handleConditionChange(i , "value", e.target.value) }
                          />
                        </div>
                    </div>
                ))}

                <div>
                    <Button className="" clicked={handleAddCondition}>
                        + Add Condition
                    </Button>
                </div>
                 <Button type="submit" className="" >
                    Save Alert
                </Button>
             </Form>    
             
        </DialogContent>
     </Dialog>
   )
}


export default CreateAlertForm
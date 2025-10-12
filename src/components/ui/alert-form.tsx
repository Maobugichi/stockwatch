import { useEffect, useState, useContext } from "react";
import { MyContext } from "../context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
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
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { getTicker } from "@/lib/utils";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { BellPlus } from "lucide-react";

const alertSchema = z.object({
    symbol: z.string().min(1, "Stock symbol is required"),
    conditions: z.array(
        z.object({
            type: z.enum(["price_above", "price_below", "volume_above"]),
            value: z.string().min(1, "Value is required").refine(
                (val) => !isNaN(Number(val)) && Number(val) > 0,
                "Value must be a positive number"
            )
        })
    ).min(1, "At least one condition is required")
});

type AlertFormValues = z.infer<typeof alertSchema>;

const CreateAlertForm = () => {
    const myContext = useContext(MyContext);
    if (!myContext) throw new Error("MyContext must be used inside provider");

    const { setNotification } = myContext;
    const [query, setQuery] = useState<string>("");
    const [options, setOptions] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
    
    const form = useForm<AlertFormValues>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            symbol: "",
            conditions: [{ type: "price_above", value: "" }]
        }
    });

    const conditions = form.watch("conditions");

    const handleAddCondition = () => {
        const currentConditions = form.getValues("conditions");
        form.setValue("conditions", [...currentConditions, { type: "price_above", value: "" }]);
    }

    const onSubmit = async (data: AlertFormValues) => {
        try {
            // Your alert creation logic here
            console.log("Form data:", data);
            
            
            
            setNotification({
                type: "success",
                message: "Alert created successfully!"
            });
            
            // Reset form and close dialog
            form.reset();
            setQuery("");
            setOpen(false);
        } catch (error) {
            setNotification({
                type: "error",
                message: "Failed to create alert"
            });
        }
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            if (!query) {
                setOptions([])
                return
            }
            getTicker(query, setOptions)
        }, 300);

        return () => clearTimeout(delay)
    }, [query])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="">
                    <BellPlus size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Stock Alert</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="shadow-none border-0">
                            <CardContent className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="symbol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Symbol</FormLabel>
                                            <FormControl>
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search ticker(AAPL, TSLA, MSFT...)"
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
                                                                            field.onChange(item.symbol);
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
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {conditions.map((cond, i) => (
                            
                            <div key={i} className="flex items-end justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name={`conditions.${i}.type`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Condition Type</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <span>{cond.type}</span>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select condition" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="price_above">
                                                        Price Above
                                                    </SelectItem>
                                                    <SelectItem value="price_below">
                                                        Price Below
                                                    </SelectItem>
                                                    <SelectItem value="volume_above">
                                                        Volume Above
                                                    </SelectItem>
                                                </SelectContent>    
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`conditions.${i}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Value</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="value"
                                                    className="border"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}

                        <div>
                            <Button type="button" className="" onClick={handleAddCondition}>
                                + Add Condition
                            </Button>
                        </div>
                        <Button type="submit" className="">
                            Save Alert
                        </Button>
                    </form>
                </Form>    
            </DialogContent>
        </Dialog>
    )
}

export default CreateAlertForm
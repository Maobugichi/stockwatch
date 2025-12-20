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
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { BellPlus } from "lucide-react";
import { useAlertForm } from "../features/alerts/hooks/useAlerts";

const CreateAlertForm = () => {
    const {
        form,
        query,
        setQuery,
        options,
        open,
        setOpen,
        conditions,
        handleAddCondition,
        onSubmit,
        isSubmitting
    } = useAlertForm();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-transparent">
                    <BellPlus size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Stock Alert</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="  shadow-none border-0">
                            <CardContent className="space-y-4 px-0 pt-4">
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
                                                               Array.isArray(options) && options.map((item: any) => (
                                                                    <CommandItem
                                                                        key={item.symbol}
                                                                        value={`${item.symbol} ${item.name}`}
                                                                        onSelect={() => {
                                                                            field.onChange(item.symbol);
                                                                            setQuery(item.symbol + " - " + item.name)
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

                        {conditions.map((cond:any, i:number) => (
                            
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
                                                <span className="text-sm text-muted-foreground">{cond.type}</span>
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
                                            <FormLabel className="text-sm text-muted-foreground">Value</FormLabel>
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

                        <div className="flex justify-between">
                            <Button type="button" className="" onClick={handleAddCondition}>
                                + Add Condition
                            </Button>
                            <Button type="submit" className="" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Alert"}
                            </Button>
                        </div>
                        
                    </form>
                </Form>    
            </DialogContent>
        </Dialog>
    )
}

export default CreateAlertForm
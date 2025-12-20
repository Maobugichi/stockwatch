// hooks/useAlertForm.ts
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/authContext";
import { AlertContext } from "@/components/context";
import api from "@/lib/axios-config";
import { getTicker } from "@/lib/utils";
import * as z from "zod";

export const alertSchema = z.object({
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

export type AlertFormValues = z.infer<typeof alertSchema>;

// API functions
const fetchTickers = async (query: string) => {
    if (!query) return [];
    return new Promise((resolve) => {
        getTicker(query, resolve);
    });
};

const createAlert = async ({ 
    userId, 
    symbol, 
    conditions 
}: { 
    userId: number; 
    symbol: string; 
    conditions: Array<{ condition_type: string; value: number }> 
}) => {
    const response = await api.post(`/api/alerts/${userId}`, {
        symbol,
        conditions
    });
    return response.data;
};

// Custom hook
export const useAlertForm = () => {
    const myContext = useContext(AlertContext);
    if (!myContext) throw new Error("MyContext must be used inside provider");

    const { user } = useAuth();
    const { setNotification } = myContext;
    const queryClient = useQueryClient();

    const [query, setQuery] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<AlertFormValues>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            symbol: "",
            conditions: [{ type: "price_above", value: "" }]
        }
    });

    const conditions = form.watch("conditions");

    // Debounced ticker search with TanStack Query
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    const { data: options = [] } = useQuery({
        queryKey: ["tickers", debouncedQuery],
        queryFn: () => fetchTickers(debouncedQuery),
        enabled: debouncedQuery.length > 0,
        staleTime: 5 * 60 * 1000,
    });

    // Create alert mutation
    const createAlertMutation = useMutation({
        mutationFn: createAlert,
        onSuccess: () => {
            setNotification({
                type: "success",
                message: "Alert created successfully!"
            });
            
            queryClient.invalidateQueries({ queryKey: ["alerts", user?.id] });
            
            form.reset();
            setQuery("");
            setOpen(false);
        },
        onError: () => {
            setNotification({
                type: "error",
                message: "Failed to create alert"
            });
        }
    });

    const handleAddCondition = () => {
        const currentConditions = form.getValues("conditions");
        form.setValue("conditions", [...currentConditions, { type: "price_above", value: "" }]);
    };

    const onSubmit = async (data: AlertFormValues) => {
        if (!user?.id) {
            setNotification({
                type: "error",
                message: "User not authenticated"
            });
            return;
        }

        createAlertMutation.mutate({
            userId: user.id,
            symbol: data.symbol,
            conditions: conditions.map((c: any) => ({
                condition_type: c.type,
                value: parseFloat(c.value)
            }))
        });
    };

    return {
        form,
        query,
        setQuery,
        options,
        open,
        setOpen,
        conditions,
        handleAddCondition,
        onSubmit,
        isSubmitting: createAlertMutation.isPending
    };
};
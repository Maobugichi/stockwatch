import { useContext } from "react";
import { AlertContext } from "@/components/context";

export const useNotify = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("MyContext must be used in provider");
    return ctx.setNotification
}
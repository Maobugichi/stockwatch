import { useContext } from "react";
import { MyContext } from "@/components/context";

export const useNotify = () => {
    const ctx = useContext(MyContext);
    if (!ctx) throw new Error("MyContext must be used in provider");
    return ctx.setNotification
}
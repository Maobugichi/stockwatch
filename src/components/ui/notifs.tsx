import { useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { AlertContext } from "../context";


const Notifications = () => {
   const myContext = useContext(AlertContext);
   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");

   const { notification } = myContext;
   
   useEffect(() => {
    console.log("notif:" + notification)
    if (!notification) return;

     console.log("Subscribing to event:", notification);
    socket.on(notification.message, (data) => {
        const { type , message , time } = data;
        switch(type) {
            case "success":
             toast.success(message, {
             description: data.time || new Date().toLocaleTimeString(),
             action:{
                label:"Undo",
                onClick:() => console.log("undo")
             }
             });
            break;
            case "error":
             toast.error(message,{
                description: time ? new Date(time).toLocaleTimeString() : undefined,
                action:{
                 label:"Undo",
                 onClick:() => console.log("undo")
                }
             });
             break;
             case "warning":
               toast.warning(message,{
                 description: time ? new Date(time).toLocaleTimeString() : undefined,
                 action:{
                  label:"Undo",
                  onClick:() => console.log("undo")
                }
               }) ;
               break;
               default:
                toast(message,{
                    description: time ? new Date(time).toLocaleTimeString() : undefined,
                    action:{
                    label:"Undo",
                    onClick:() => console.log("undo")
                    }
                });
                break;
        }
        
    });

    return () => {
        socket.off(notification.message)
    }
   
   },[notification])

   return null
}

export default Notifications
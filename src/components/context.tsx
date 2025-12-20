import { createContext, useState, type SetStateAction , useMemo } from "react"

interface ContextProps {
  children:React.ReactNode
}

interface NotifProp {
    type:string,
    message:string
}

interface UserContext {
    notification:NotifProp;
    setNotification:React.Dispatch<SetStateAction<NotifProp>>
}

const AlertContext = createContext<UserContext | undefined>(undefined);

const ContextProvider:React.FC<ContextProps> = ({ children }) => {
    const [ notification, setNotification ] = useState<NotifProp>({
        type:"",
        message:""
    });

    const contextValue = useMemo(
        () => ({ notification, setNotification }),
        [notification]
    );

     return <AlertContext.Provider value={contextValue}>{children}</AlertContext.Provider>;
};

export { AlertContext , ContextProvider}
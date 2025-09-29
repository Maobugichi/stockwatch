import { createContext, useState, type SetStateAction , useMemo } from "react"

interface ContextProps {
  children:React.ReactNode
}

interface UserContext {
    notification:string;
    setNotification:React.Dispatch<SetStateAction<string>>
}

const MyContext = createContext<UserContext | undefined>(undefined);

const ContextProvider:React.FC<ContextProps> = ({ children }) => {
    const [ notification, setNotification ] = useState<string>("");

    const contextValue = useMemo(
        () => ({ notification, setNotification }),
        [notification]
    );

     return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export { MyContext , ContextProvider}
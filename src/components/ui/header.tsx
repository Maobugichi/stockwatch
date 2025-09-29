import Holdings from "../holdings"
import { useState } from "react";
import {  addToWatchList, submitPortfolio } from "@/lib/utils";
import CreateAlertForm from "./alert-form";
import { Eye, PlusCircle } from "lucide-react";
import type { UserChoiceType , UserChoiceTypeWatch } from "@/types";
import { StockWatcherLogo } from "../logo";


interface HeaderProp {
    style:any
}

const Header:React.FC<HeaderProp> = ({style}) => {
    const [ query , setQuery ] = useState<string>('');
    const [ open , setOpen ] = useState<boolean>(false);
    const [ userChoice , setUserChoice ] = useState<UserChoiceType>({
        ticker:"",
        shares:"",
        buyPrice:""
    });
    const [ queryWatch , setQueryWatch ] = useState<string>('');
    const [ openWatch , setOpenWatch ] = useState<boolean>(false);
    const [ userChoiceWatch , setUserChoiceWatch ] = useState<UserChoiceTypeWatch>({
            ticker:""
    });
    return(
        <header 
        style={style}
        className="fixed px-4 top-0 h-16 bg-black  text-white backdrop-blur-2xl w-full z-50 flex items-center">
            <StockWatcherLogo/>
            <div className="flex  w-[80%] md:w-full  mx-auto h-[80%] justify-end ">
                <div className="w-[40%] flex gap-5">
                    
                    <Holdings
                    header={<span className="flex bg-black text-white p-2 rounded-sm items-center justify-center text-sm md:text-md gap-1 md:gap-3"><PlusCircle size={20}/>  <p>Hodlings</p></span>}
                    type="+ add to portfolio"
                    query={query}
                    setQuery={setQuery}
                    open={open}
                    setOpen={setOpen}
                    userChoice={userChoice}
                    setUserChoice={setUserChoice}
                    submitDetails={submitPortfolio}
                    />
                    <CreateAlertForm/>
                    <Holdings
                    type="Add to Watchlist"
                    header={<Eye/>}
                    query={queryWatch}
                    setQuery={setQueryWatch}
                    open={openWatch}
                    setOpen={setOpenWatch}
                    userChoice={userChoiceWatch}
                    setUserChoice={setUserChoiceWatch}
                    submitDetails={addToWatchList}
                    />
                </div>
                
            </div>
        </header>
    )
}

export default Header
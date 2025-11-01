import Holdings from "../holdings"
import { useState } from "react";
import CreateAlertForm from "./alert-form";
import { Eye, PlusCircle } from "lucide-react";
import type { UserChoiceType , UserChoiceTypeWatch } from "@/types";
import { StockWatcherLogo } from "../logo";
import { UserMenu } from "./usermenu";


interface HeaderProp {
    style:any
}



const Header:React.FC<HeaderProp> = ({style}) => {
  const [ open , setOpen ] = useState<boolean>(false);
    const [ userChoice , setUserChoice ] = useState<UserChoiceType>({
        ticker:"",
        shares:"",
        buyPrice:""
    });
  
    const [ openWatch , setOpenWatch ] = useState<boolean>(false);
    const [ userChoiceWatch , setUserChoiceWatch ] = useState<UserChoiceTypeWatch>({
            ticker:""
    });

  return (
    <header
      style={style}
      className="fixed top-0 z-50  h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 md:w-[95.5%] w-full right-0"
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <StockWatcherLogo />

      
        <div className="flex items-center gap-2 md:gap-3">
          <Holdings
            header={<PlusCircle size={20} />}
            type="portfolio"
            open={open}
            setOpen={setOpen}
            userChoice={userChoice}
            setUserChoice={setUserChoice}
          />
          
          <CreateAlertForm />
          
          <Holdings
            type="watchlist"
            header={<Eye size={20} />}
            open={openWatch}
            setOpen={setOpenWatch}
            userChoice={userChoiceWatch}
            setUserChoice={setUserChoiceWatch}
          />

          {/* Divider */}
          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

         <UserMenu/>
        </div>
      </div>
    </header>
  );
};


export default Header
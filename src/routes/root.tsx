import Nav from "@/components/nav";
import { Outlet, useNavigation } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/ui/header";
import { motion } from "motion/react";
import { ClipLoader } from "react-spinners";

const Root: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);  
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
 console.log("hello")
  return (
    <main className="flex min-h-[100vh] h-fit pb-16 md:pb-0 overflow-hidden">
     
      <div className="flex-shrink-0">
        <Nav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      </div>    
      <div className="flex flex-col flex-1 min-w-0 w-0">
        <Header style={{}}/>
        <motion.div
          className="flex-1 overflow-x-auto md:overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
         
          <div className="absolute inset-0 mt-16 overflow-auto">
            <div className="min-h-full md:p-4 ">
             {isLoading ? <div className="h-[80vh] grid place-items-center"><ClipLoader color="#3b82f6" size={40} /></div> : <Outlet />}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};


export default Root;

export function HydrateFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <ClipLoader />
    </div>
  );
}
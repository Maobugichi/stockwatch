import Nav from "@/components/nav";
import { Outlet, useNavigation } from "react-router-dom";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import Header from "@/components/ui/header";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import ScrollToTop from "@/scroll-to-top";
import { StockDashboardProvider } from "@/components/features/dashboard/context";

const Root: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);  
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const scrollContainerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  
  return (
    <main className="bg-[#06070B] min-h-screen pb-16 md:pb-0">
    
      <Nav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
    
      <Header isOpen={isNavOpen} style={{}}/>
         
      <motion.div 
        className="pt-16 min-h-screen " 
        animate={{ 
          marginLeft: window.innerWidth >= 768 ? (isNavOpen ? 200 : 60) : 0
        }}
        transition={{ 
          duration: 0.3, 
          type: "spring", 
          stiffness: 20,
          damping: 15
        }}
      >
        <motion.div
          className="overflow-x-auto md:overflow-hidden bg-[#06070B] relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="min-h-full py-5 px-4 max-w-full">
            {isLoading ? (
              <motion.div 
                className="h-screen grid place-items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ClipLoader color="white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ScrollToTop scrollContainerRef={scrollContainerRef}/>
                <StockDashboardProvider>
                  <Outlet />
                </StockDashboardProvider>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
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
      height: '100vh',
      backgroundColor: '#06070B'
    }}>
      <ClipLoader color="white" />
    </div>
  );
}
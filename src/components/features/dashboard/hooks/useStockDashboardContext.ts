import { useContext } from "react";
import { StockDashboardContext } from "../context";

export const useStockDashboard = () => {
  const context = useContext(StockDashboardContext);
  
  if (context === undefined) {
    throw new Error('useStockDashboard must be used within a StockDashboardProvider');
  }
  
  return context;
};
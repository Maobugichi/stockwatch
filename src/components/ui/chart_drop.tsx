import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";
import { useState , useEffect, type SetStateAction } from "react";
import { useNavigate , useLocation } from "react-router-dom";

type TimePeriodOption = {
  label: string
  value: string
  days: number
  interval: string
}

const timePeriodOptions = [
  { label: "1d", value: "1d", days: 1, interval: "1m" },
  { label: "1w", value: "1w", days: 7, interval: "15m" },
  { label: "1m", value: "1m", days: 30, interval: "1d" },
  { label: "3m", value: "3m", days: 90, interval: "1d" },
  { label: "1y", value: "1y", days: 365, interval: "1wk" },
];
interface TimePeriodSelectProps {
  value?: string
  period:string;
  setPeriod:React.Dispatch<SetStateAction<string>>
  className?: string
}
const TimePeriodDropdown = ({ className , period, setPeriod }: TimePeriodSelectProps) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  async function submitChartData(value:string) {
    const option = timePeriodOptions.find(opt => opt.value == value)
    if (option) {
       const now = Math.floor(Date.now() / 1000);
      let period1 = now - option.days * 24 * 60 * 60;
      const period2 = now;
      if (option.interval === "1m") {
        const startDate = new Date(period1 * 1000);
      
        if (startDate.getUTCDay() === 0) period1 -= 2 * 24 * 60 * 60; 
        else if (startDate.getUTCDay() === 6) period1 -= 1 * 24 * 60 * 60; 
      
        if (startDate.getUTCMonth() === 8 && startDate.getUTCDate() <= 7 && startDate.getUTCDay() === 1) {
          period1 -= 3 * 24 * 60 * 60; 
        }
      }
        navigate(`${location.pathname}?period=${value}&period1=${period1}&period2=${period2}&interval=${option.interval}`);
        setPeriod(value);
    }
  }

  useEffect(() => {
      const params = new URLSearchParams(location.search);
       const value = params.get("period"); 
        if (value && timePeriodOptions.some(opt => opt.value === value)) {
            setPeriod(value);
        }
  }, [location.search]);


  return (
    <Select value={period} onValueChange={submitChartData}>
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Period" />
      </SelectTrigger>
      <SelectContent>
         {timePeriodOptions.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePeriodDropdown
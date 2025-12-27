import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

type Option = {
  value: string;
  label: string;
};

interface FilterSelectProps {
  value: string;
  onChange: any;
  icon: ReactNode;
  options: Option[];
  placeholder?: string;
}

const FilterSelect = ({
  value,
  onChange,
  icon,
  options,
  placeholder,
}: FilterSelectProps) => {
  return (
    <Select   value={value} onValueChange={onChange}>
      <SelectTrigger className="flex-1 border border-[#526FFF] bg-[#526FFF]/10 text-[#526FFF]  rounded-3xl h-11">
        {icon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;

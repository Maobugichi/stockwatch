import { MdTune } from "react-icons/md";
import { Badge } from "@/components/ui/badge";

const AlertsHeader = () => {
  return (
     <div className="bg-transparent text-white border-b flex px-5 justify-between md:w-full  gap-3 sticky top-0 z-20 ">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-between  gap-2 pb-3">
          <MdTune />
          <span className="hidden md:block">Manage Your Alerts</span>
        </h2>
        <Badge className="text-[#526FFF] bg-[#14151C] h-6 border border-[rgba(34,36,45,0.5)]">Smart Alerts</Badge>
      </div>
  );
};

export default AlertsHeader;
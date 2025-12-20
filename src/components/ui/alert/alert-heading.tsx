import { MdTune } from "react-icons/md";
import { Badge } from "@/components/ui/badge";

const AlertsHeader = () => {
  return (
     <div className="bg-white border-b flex mx-5 justify-between md:w-full  gap-3 sticky top-0 z-20 text-black">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-between  gap-2 pb-3">
          <MdTune />
          <span className="hidden md:block">Manage Your Alerts</span>
        </h2>
        <Badge className="text-purple-500 bg-gray-200 h-5 py-2">Smart Alerts</Badge>
      </div>
  );
};

export default AlertsHeader;
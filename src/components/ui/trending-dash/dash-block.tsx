import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  description: string;
  gradientClass?: string;
}

const StatCard = ({ title, icon, value, description, gradientClass }: StatCardProps) => {
  return (
    <Card className=" group shadow-none relative bg-[#14151C]/40 border border-[#14151C] text-[rgb(252,252,252)] font-inter h-32 rounded-3xl overflow-hidden">
   
      <div className={`absolute top-0 left-0 right-0 h-1 ${gradientClass} rounded-t-3xl`} />
      
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300s ${gradientClass}`} />
      
      <CardHeader className="h-[20%]">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[80%] flex flex-col items-end">
        <div className="text-4xl font-jet font-bold">{value}</div>
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
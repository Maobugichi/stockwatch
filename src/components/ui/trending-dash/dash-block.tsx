import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  description: string;
  gradientClass: string;
}

const StatCard = ({ title, icon, value, description, gradientClass }: StatCardProps) => {
  return (
    <Card className={`border shadow font-inter  h-[130px]`}>
      <CardHeader className=" h-[20%]">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className=" h-[80%] flex flex-col items-end">
        <div className="text-4xl font-jet font-bold">{value}</div>
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;

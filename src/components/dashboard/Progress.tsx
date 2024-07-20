import React from "react";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface ProgressCardProps {
  title: string;
  value: number;
  goal: number;
  icon: React.ReactNode;

}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  goal,
  icon,

}) => {
  const progress = Math.min((value / goal) * 100, 100);

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardDescription className="flex flex-row items-center gap-2 mb-2">
          {icon}
          <span className="items-center">{title}</span>
        </CardDescription>
        <CardTitle className="text-xl font-bold">{value}</CardTitle>
      </CardHeader>

      <CardFooter>
        <Progress value={progress} className="h-[4px]" />
      </CardFooter>
    </Card>
  );
};

export default ProgressCard;

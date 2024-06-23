import React from "react";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "../ui/progress";

interface ProgressCardProps {
  title: string;
  value: number;
  goal: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, goal }) => {
    const progress = Math.min((value / goal) * 100, 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Progress value={progress} color="emerald-600" />
        <p className="text-xs text-muted-foreground">
          {value} / {goal} {title}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
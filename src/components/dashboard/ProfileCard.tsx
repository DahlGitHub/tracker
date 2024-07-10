import { BellRing, Check, Dumbbell, Edit, Wheat } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSession } from "@clerk/nextjs";
import UserGoal from "./UserGoal";
import { BackgroundBeams } from "../ui/background-beams";
import QuickButton from "./QuickButton";
import AddProgram from "../products/AddProducts";
import AddFood from "../schedule/food/AddFood";
import AddData from "../schedule/workout/AddData";

type CardProps = React.ComponentProps<typeof Card>;

const ProfileCard: any = ({ className, ...props }: CardProps) => {
  const { session } = useSession();
  return (
    <Card className={cn("w-[380px] mb-4", className)} {...props}>
      <CardHeader>
        <CardTitle>Hello, {session?.user.firstName}</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <hr />
      </CardHeader>
      <CardContent className="grid gap-4">
        <QuickButton
          icon={<Edit size={24} />}
          title="Goals"
          description="Adjust your nutrition goals."
          Component={<UserGoal />}
        />
        <QuickButton
          icon={<Wheat />}
          title="Food Schedule"
          description="Log your food schedule."
          Component={<AddFood />}
        />
        <QuickButton
          icon={<Dumbbell />}
          title="Workout Schedule"
          description="Log your workout schedule."
          Component={<AddData />}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

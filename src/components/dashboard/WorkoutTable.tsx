import moment from "moment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface WorkoutData {
  date: any; // Adjust the type according to your data structure
  title: string;
  icon: string;
  count?: number;
}

interface WorkoutTableProps {
  data: WorkoutData[];
  title: string;
  description: string;
  type: "recent" | "top"; // Add type prop to differentiate between recent and top workouts
}

const WorkoutTable: React.FC<WorkoutTableProps> = ({
  data,
  title,
  description,
  type,
}) => {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row">
        <div className="grid gap-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button asChild size="sm" variant="outline" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workout</TableHead>
              <TableHead className="text-end">{type === "recent" ? "" : "Amount"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((workout, index) => (
              <TableRow key={index}>
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-10 w-10 sm:flex border p-1 border-zinc-600">
                      <AvatarImage src={workout.icon} alt="Avatar" />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-semibold leading-none">
                        {workout.title}
                      </p>
        
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-end py-4">
                  {type === "recent"
                    ? moment(workout.date.toDate()).format("ddd, D. MMM")
                    : workout.count || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorkoutTable;

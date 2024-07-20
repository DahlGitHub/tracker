import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSession } from "@clerk/nextjs";
import moment from "moment";

type MonthData = {
  month: string;
  foodsCount: number;
  workoutsCount: number;
};

const chartConfig = {
  foods: {
    label: "Foods",
    color: "hsl(var(--chart-1))",
  },
  workouts: {
    label: "Workouts",
    color: "hsl(var(--chart-2))",
  },
} as ChartConfig;

const LineChartComponent = () => {
  const [chartData, setChartData] = useState<MonthData[]>([]);
  const { session } = useSession();

  useEffect(() => {
    const fetchMonthlyLogs = async () => {
      if (!session || !session.user) return;

      const userId = session.user.id;

      try {
        // Fetch foods data
        const foodsQuery = query(
          collection(db, "food"),
          where("userID", "==", userId)
        );

        const foodsSnapshot = await getDocs(foodsQuery);

        // Fetch workout schedules data
        const workoutsQuery = query(
          collection(db, "workoutSchedules"),
          where("userID", "==", userId)
        );

        const workoutsSnapshot = await getDocs(workoutsQuery);

        // Initialize counts for each month
        const logsCountByMonth: Record<string, MonthData> = {};

        foodsSnapshot.forEach((doc) => {
          const date = doc.data().date.toDate();
          const monthKey = moment(date).format("MMMM YYYY");
          if (!logsCountByMonth[monthKey]) {
            logsCountByMonth[monthKey] = { month: monthKey, foodsCount: 0, workoutsCount: 0 };
          }
          logsCountByMonth[monthKey].foodsCount++;
        });

        workoutsSnapshot.forEach((doc) => {
          const date = doc.data().date.toDate();
          const monthKey = moment(date).format("MMMM YYYY");
          if (!logsCountByMonth[monthKey]) {
            logsCountByMonth[monthKey] = { month: monthKey, foodsCount: 0, workoutsCount: 0 };
          }
          logsCountByMonth[monthKey].workoutsCount++;
        });

        // Generate data array from logsCountByMonth
        const data: MonthData[] = Object.values(logsCountByMonth);

        // Sort data by month
        data.sort((a, b) => {
          const dateA = moment(a.month, "MMMM YYYY");
          const dateB = moment(b.month, "MMMM YYYY");
          return dateA.isBefore(dateB) ? -1 : 1;
        });

        setChartData(data);
      } catch (error) {
        console.error("Error fetching monthly logs:", error);
      }
    };

    fetchMonthlyLogs();
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly logs</CardTitle>
        <CardDescription>Logs count for meals and workouts per Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[120px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="foodsCount"
              label="Meals"
              type="natural"
              stroke="var(--color-foods)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-foods)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="foodsCount"
              />
            </Line>
            <Line
              dataKey="workoutsCount"
              type="monotone"
              stroke="var(--color-workouts)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-workouts)",
              }}
              activeDot={{
                r: 2,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="workoutsCount"
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;

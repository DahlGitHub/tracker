import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";
import { toDate } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSession } from "@clerk/nextjs";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type DayData = {
  date: string;
  totalKcal: number;
  totalProteins: number;
  totalFat: number;
  totalCarbs: number;
};

const chartConfig = {
  totalKcal: {
    label: "Kcal",
    color: "hsl(var(--chart-1))",
  },
  totalProteins: {
    label: "Proteins",
    color: "hsl(var(--chart-2))",
  },
  totalFat: {
    label: "Fat",
    color: "hsl(var(--chart-1))",
  },
  totalCarbs: {
    label: "Carbs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


const Barchart = () => {
  const [chartData, setChartData] = React.useState<DayData[]>([]);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("totalKcal"); // Default active chart
  const { session } = useSession();

  React.useEffect(() => {
    const fetchDailyIntake = async () => {
      if (!session || !session.user) return;

      const userId = session.user.id;

      try {
        // Calculate date range for last 3 months
        const endDate = moment().endOf("day");
        const startDate = moment().subtract(3, "months").startOf("day");

        // Initialize data structure to store daily totals
        const dailyIntake: Record<string, DayData> = {};

        // Query data from Firestore
        const q = query(
          collection(db, "food"), // Replace with your Firestore collection name
          where("userID", "==", userId),
          where("date", ">=", startDate.toDate()),
          where("date", "<=", endDate.toDate())
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dateKey = moment(data.date.toDate()).format("YYYY-MM-DD");

          // If dateKey doesn't exist in dailyIntake, initialize it
          if (!dailyIntake[dateKey]) {
            dailyIntake[dateKey] = {
              date: dateKey,
              totalKcal: 0,
              totalProteins: 0,
              totalFat: 0,
              totalCarbs: 0,
            };
          }

          // Add current doc's totals to dailyIntake
          dailyIntake[dateKey].totalKcal += data.totalKcal;
          dailyIntake[dateKey].totalProteins += data.totalProteins;
          dailyIntake[dateKey].totalFat += data.totalFat;
          dailyIntake[dateKey].totalCarbs += data.totalCarbs;
        });

        // Prepare final chartData array, including days with no records
        const data: DayData[] = [];

        let currentDate = moment(startDate);
        while (currentDate.isSameOrBefore(endDate)) {
          const dateKey = currentDate.format("YYYY-MM-DD");
          const dailyData = dailyIntake[dateKey] || {
            date: dateKey,
            totalKcal: 0,
            totalProteins: 0,
            totalFat: 0,
            totalCarbs: 0,
          };
          data.push(dailyData);
          currentDate = currentDate.add(1, "day");
        }

        setChartData(data);

        // Print the fetched and structured data to the console
        console.log("Fetched chart data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDailyIntake();
  }, [session]);

  const total = React.useMemo(() => {
    if (chartData.length === 0) return { totalKcal: 0, totalProteins: 0, totalFat: 0, totalCarbs: 0};

    const filteredChartData = chartData.filter(
      (day) => day.totalKcal > 0 && day.totalProteins > 0 && day.totalFat > 0 && day.totalCarbs > 0
    );

    if (filteredChartData.length === 0) return { totalKcal: 0, totalProteins: 0, totalFat: 0, totalCarbs: 0};

    const totalDays = filteredChartData.length;
    const totalKcal = filteredChartData.reduce(
      (acc, curr) => acc + curr.totalKcal,
      0
    );
    const totalProteins = filteredChartData.reduce(
      (acc, curr) => acc + curr.totalProteins,
      0
    );
    const totalFat = filteredChartData.reduce(
      (acc, curr) => acc + curr.totalFat,
      0
    );
    const totalCarbs = filteredChartData.reduce(
      (acc, curr) => acc + curr.totalCarbs,
      0
    );

    return {
      totalKcal: totalKcal / totalDays,
      totalProteins: totalProteins / totalDays,
      totalFat: totalFat / totalDays,
      totalCarbs: totalCarbs / totalDays,
    };
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-6">
          <CardTitle>Daily Intake</CardTitle>
          <CardDescription>
            Daily total intake past 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["totalKcal", "totalProteins", "totalFat", "totalCarbs"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                Avg. {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                {Math.round(total[key as keyof typeof total]).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[200px] w-full"
>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
          </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Barchart;

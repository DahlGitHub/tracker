"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { toDate } from "date-fns";

const chartConfig = {

  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Sample data for the most recent dates
const recentData = [
  { date: moment().subtract(4), desktop: 186, mobile: 80 },
  { date: moment().subtract(4), desktop: 305, mobile: 200 },
  { date: moment().subtract(4), desktop: 237, mobile: 120 },
  { date: moment().subtract(4), desktop: 73, mobile: 190 },
  { date: moment().subtract(4), desktop: 209, mobile: 130 },
  { date: moment().subtract(4), desktop: 186, mobile: 80 },
  { date: moment().subtract(4), desktop: 305, mobile: 200 },
];

const Barchart = () => {
  return (
    <Card>
      <CardHeader>
      <div className="grid gap-2">
          <CardTitle>Recent Meals</CardTitle>
          <CardDescription>
            Your recent meals and total nutritional intake
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={recentData} barSize={15}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => moment(value).format("MMM, YYYY")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={2} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Barchart;

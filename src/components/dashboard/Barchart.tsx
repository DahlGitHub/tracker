"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "../ui/card";
import moment from "moment";

// Sample data for the most recent dates
const recentData = [
  {
    date: moment().subtract(4, "days").format("ddd, D. MMM"),
    proteins: Math.floor(Math.random() * 50) + 100, // Proteins range from 100 to 150
    calories: Math.floor(Math.random() * 500) + 1500, // Calories range from 1500 to 2000
  },
  {
    date: moment().subtract(3, "days").format("ddd, D. MMM"),
    proteins: Math.floor(Math.random() * 50) + 100,
    calories: Math.floor(Math.random() * 500) + 1500,
  },
  {
    date: moment().subtract(2, "days").format("ddd, D. MMM"),
    proteins: Math.floor(Math.random() * 50) + 100,
    calories: Math.floor(Math.random() * 500) + 1500,
  },
  {
    date: moment().subtract(1, "days").format("ddd, D. MMM"),
    proteins: Math.floor(Math.random() * 50) + 100,
    calories: Math.floor(Math.random() * 500) + 1500,
  },
  {
    date: moment().format("ddd, D. MMM"),
    proteins: Math.floor(Math.random() * 50) + 100,
    calories: Math.floor(Math.random() * 500) + 1500,
  },
];

const Barchart = () => {
  return (
    <Card className="p-2">
      <ResponsiveContainer width="100%" height={470}>
        <BarChart
          data={recentData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[0, 2000]}
            ticks={[0, 500, 1000, 1500, 2000]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[0, 200]}
            ticks={[0, 50, 100, 150, 200]}
          />
          <Tooltip
            position={{ y: 0 }}
            cursor={false}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "#fff",
            }}
          />
          <Legend iconType="line" verticalAlign="top" height={36} />
          <Bar
            yAxisId="left"
            dataKey="calories"
            fill="#8884d8"
            name="Calories"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar
            yAxisId="right"
            dataKey="proteins"
            fill="#82ca9d"
            name="Proteins"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Barchart;

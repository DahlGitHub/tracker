import {
    Radar,
    RadarChart,
    ResponsiveContainer,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    Tooltip,
  } from "recharts";
  import { Card } from "../ui/card";
  
// Sample raw data
const rawData = [
    { subject: "Chest", count: 15 },
    { subject: "Shoulders", count: 12 },
    { subject: "Back", count: 18 },
    { subject: "Arms", count: 20 },
    { subject: "Abs", count: 10 },
    { subject: "Legs", count: 14 },
  ];
  
  // Calculate the maximum count
  const maxCount = Math.max(...rawData.map(item => item.count));
  
  // Normalize the data to percentages
  const data = rawData.map(item => ({
    subject: item.subject,
    Percentage: (item.count / maxCount) * 100,
  }));
  
  
  const Radarchart = () => {
    return (
      <Card className="p-4 shadow-lg rounded-lg">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#ccc" />
            <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={14} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" />
            <Radar
              name="Muscle Group"
              dataKey="Percentage"
              stroke="#73ffa8"
              strokeWidth={2}
              fill="#82ca9d"
              fillOpacity={0.6}
              dot={{ fill: '#82ca9d', r: 3 }}
            />
            <Legend verticalAlign="top" iconType="line" height={36} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "#fff",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    );
  };
  
  export default Radarchart;
  
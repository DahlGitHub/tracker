import Link from "next/link";
import { Activity, ArrowUpRight, Dot, Milk } from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust the import path according to your project structure
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import moment from "moment";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import MealCell from "../MealCell";
import { useSession } from "@clerk/nextjs";

interface Meal {
  icon: string;
  id: string;
  name: string;
}

interface MealData {
  date: Timestamp;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  supper: Meal;
  totalKcal: number;
  totalProteins: number;
}

export default function Component() {
  const [mealData, setMealData] = useState<MealData[]>([]);
  const { session } = useSession();
  const goalKcal = 2000;
  const goalProteins = 150;

  useEffect(() => {
    const fetchMealData = async () => {
      if (session && session.user) {
        const q = query(
          collection(db, "food"),
          where("userID", "==", session.user.id),
          orderBy("date", "desc"),
          limit(7)
        );
        const querySnapshot = await getDocs(q);
        const fetchedData: MealData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
            date: data.date,
            breakfast: data.breakfast,
            lunch: data.lunch,
            dinner: data.dinner,
            supper: data.supper,
            totalKcal: data.totalKcal,
            totalProteins: data.totalProteins,
          });
        });
        setMealData(fetchedData);
      }

      fetchMealData();
    };
  }, []);

  const calculatePercentage = (kcal: number, proteins: number) => {
    const kcalPercentage = Math.min((kcal / goalKcal) * 100, 100);
    const proteinsPercentage = Math.min((proteins / goalProteins) * 100, 100);
    const averagePercentage = Math.round(
      (kcalPercentage + proteinsPercentage) / 2
    );
    return averagePercentage;
  };

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row">
        <div className="grid gap-2">
          <CardTitle>Recent Meals</CardTitle>
          <CardDescription>
            Your recent meals and total nutritional intake
          </CardDescription>
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
              <TableHead>Goal</TableHead>
              <TableHead>Breakfast</TableHead>
              <TableHead>Lunch</TableHead>
              <TableHead>Dinner</TableHead>
              <TableHead>Supper</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Proteins</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mealData.map((meal, index) => {
              const percentage = calculatePercentage(
                meal.totalKcal,
                meal.totalProteins
              );
              return (
                <TableRow key={index}>
                  <TableCell>
                    <CircularProgress
                      value={percentage}
                      size={40}
                      color="#CBD5E0"
                      trackColor="#2D3748"
                      thickness={5}
                    >
                      <CircularProgressLabel>{`${percentage}%`}</CircularProgressLabel>
                    </CircularProgress>
                  </TableCell>
                  <TableCell>
                    <MealCell
                      mealName={meal.breakfast.name}
                      iconName={meal.breakfast.icon}
                    />
                  </TableCell>
                  <TableCell>
                    <MealCell
                      mealName={meal.lunch.name}
                      iconName={meal.lunch.icon}
                    />
                  </TableCell>
                  <TableCell>
                    <MealCell
                      mealName={meal.dinner.name}
                      iconName={meal.dinner.icon}
                    />
                  </TableCell>
                  <TableCell>
                    <MealCell
                      mealName={meal.supper.name}
                      iconName={meal.supper.icon}
                    />
                  </TableCell>
                  <TableCell className="text-right">{meal.totalKcal}</TableCell>
                  <TableCell className="text-right">
                    {meal.totalProteins}
                  </TableCell>
                  <TableCell className="text-end py-4">
                    <div className="py-1 text-xs">
                      {moment(meal.date.toDate()).format("ddd, D. MMM")}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

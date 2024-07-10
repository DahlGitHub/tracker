import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import ProgressCard from "@/components/dashboard/Progress";
import { fetchGoals, Goals } from "./GoalsData";
import { useSession } from "@clerk/nextjs";

interface ProgressSectionProps {
  selectedDate: Date;
}

const getStartOfDayTimestamp = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(start);
};

const getEndOfDayTimestamp = (date: Date) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return Timestamp.fromDate(end);
};

const ProgressSection: React.FC<ProgressSectionProps> = ({ selectedDate }) => {
  const { session } = useSession();
  const [goals, setGoals] = useState<Goals>({ kcal: 0, proteins: 0, fat: 0, carbs: 0 });
  const [dailyIntake, setDailyIntake] = useState({
    totalKcal: 0,
    totalProteins: 0,
    totalFat: 0,
    totalCarbs: 0,
  });

  useEffect(() => {
    const fetchUserGoals = async () => {
      if (session?.user?.id) {
        const fetchedGoals = await fetchGoals(session.user.id);
        setGoals(fetchedGoals);
      }
    };

    fetchUserGoals();
  }, [session]);

  useEffect(() => {
    const fetchDailyIntake = async () => {
      const startOfDay = getStartOfDayTimestamp(selectedDate);
      const endOfDay = getEndOfDayTimestamp(selectedDate);

      const q = query(
        collection(db, "food"),
        where("date", ">=", startOfDay),
        where("date", "<=", endOfDay)
      );

      const querySnapshot = await getDocs(q);

      let totalKcal = 0,
        totalProteins = 0,
        totalFat = 0,
        totalCarbs = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalKcal += data.totalKcal;
        totalProteins += data.totalProteins;
        totalFat += data.totalFat;
        totalCarbs += data.totalCarbs;
      });

      setDailyIntake({
        totalKcal,
        totalProteins,
        totalFat,
        totalCarbs,
      });
    };

    fetchDailyIntake();
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

      <ProgressCard
        title="Calories"
        value={dailyIntake.totalKcal}
        goal={goals.kcal}
        key="calories"
      />
      <ProgressCard
        title="Proteins"
        value={dailyIntake.totalProteins}
        goal={goals.proteins}
        key="proteins"
      />
      <ProgressCard
        title="Fats"
        value={dailyIntake.totalFat}
        goal={goals.fat}
        key="fats"
      />
      <ProgressCard
        title="Carbohydrates"
        value={dailyIntake.totalCarbs}
        goal={goals.carbs}
        key="carbs"
      />
    </div>
  );
};

export default ProgressSection;

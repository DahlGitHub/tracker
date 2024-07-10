import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust the import path according to your project structure
import WorkoutTable from "./WorkoutTable"; // Adjust the import path according to your project structure

interface WorkoutData {
  date: Timestamp;
  title: string;
  icon: string;
  count?: number;
}

const TopWorkoutData: React.FC = () => {
  const [topWorkouts, setTopWorkouts] = useState<WorkoutData[]>([]);

  useEffect(() => {
    const fetchTopWorkouts = async () => {
      const q = query(
        collection(db, "workoutSchedules"),
        orderBy("count", "desc"),
        limit(5)
      ); // Assuming `count` field exists for top workouts
      const querySnapshot = await getDocs(q);
      setTopWorkouts(
        querySnapshot.docs.map((doc) => doc.data() as WorkoutData)
      );
    };

    fetchTopWorkouts();
  }, []);

  return (
    <WorkoutTable
      data={topWorkouts}
      title="Top Workouts"
      description="Your top workouts"
      type={"top"}
    />
  );
};

export default TopWorkoutData;

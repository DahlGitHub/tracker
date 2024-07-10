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

// Fake data for recent workouts

const RecentWorkoutData: React.FC = () => {
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutData[]>([]);


  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      const q = query(
        collection(db, "workoutSchedules"),
        orderBy("date", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      setRecentWorkouts(
        querySnapshot.docs.map((doc) => doc.data() as WorkoutData)
      );
    };

    fetchRecentWorkouts();
  }, []);
  

  return (
    <WorkoutTable
      data={recentWorkouts}
      title="Recent Workouts"
      description="Your recent workouts"
      type={"recent"}
    />
  );
};

export default RecentWorkoutData;

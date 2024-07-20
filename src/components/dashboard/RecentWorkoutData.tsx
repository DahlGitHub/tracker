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
import WorkoutTable from "./WorkoutTable"; // Adjust the import path according to your project structure
import { useSession } from "@clerk/nextjs";

interface WorkoutData {
  date: Timestamp;
  title: string;
  icon: string;
  count?: number;
}

// Fake data for recent workouts

const RecentWorkoutData: React.FC = () => {
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutData[]>([]);
  const { session } = useSession();

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      if (session && session.user) {
      const q = query(
        collection(db, "workoutSchedules"),
        where("userID", "==", session.user.id), // Assuming `userID` field exists for workouts
        orderBy("date", "desc"),
        limit(7)
      );
      const querySnapshot = await getDocs(q);
      setRecentWorkouts(
        querySnapshot.docs.map((doc) => doc.data() as WorkoutData)
      );
    };

    fetchRecentWorkouts();
  }
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

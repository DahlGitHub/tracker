import { useState, useEffect } from "react";
import { Workout } from "./WorkoutTable";

export const useFetchWorkoutData = (page: number) => {
  const [workoutData, setWorkoutData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0); // Assuming page_count is a number

  const fetchWorkoutEvents = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy?page=${page}&pageSize=10`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setWorkoutData(data.workouts);
      setPageCount(data.page_count); // Assuming this is how page_count is returned
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutEvents(page);
  }, [page]);

  return { workoutData, loading, error, page_count: pageCount }; // Return page_count here
};

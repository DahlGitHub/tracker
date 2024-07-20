import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

interface Set {
  index: number;
  set_type: string;
  weight_kg: number | null;
  reps: number | null;
  distance_meters: number | null;
  duration_seconds: number | null;
  rpe: number | null;
}

interface Exercise {
  index: number;
  title: string;
  notes: string;
  exercise_template_id: string;
  supersets_id: number;
  sets: Set[];
}

interface Workout {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  created_at: string;
  exercises: Exercise[];
}

interface WorkoutData {
  page: number;
  page_count: number;
  workouts: Workout[];
}

const WorkoutEvents = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWorkoutEvents = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy?page=${page}&pageSize=10`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: WorkoutData = await response.json();
      setWorkoutData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutEvents(currentPage);
  }, [currentPage]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (workoutData && currentPage < workoutData.page_count) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h1>Workout Events</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workoutData && workoutData.workouts.length > 0 ? (
            workoutData.workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell className="font-medium">{workout.title}</TableCell>
                <TableCell>{workout.description}</TableCell>
                <TableCell>{new Date(workout.start_time).toLocaleString()}</TableCell>
                <TableCell>{new Date(workout.end_time).toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No workouts found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="pagination-controls">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {workoutData?.page_count}</span>
        <Button onClick={handleNextPage} disabled={workoutData ? currentPage >= workoutData.page_count : true}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default WorkoutEvents;

import React, { useEffect, useState } from "react";
import WorkoutScheduleForm, { FormSchema } from "./Form";
import { z } from "zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

type EditDataProps = {
  docId: string;
};

type DefaultValuesType = {
  date: Date;
  workoutId: string;
  intensity: string;
  icon?: string;
  title?: string;
  muscleType?: string;
  muscleGroup?: string[];
};

const EditData: React.FC<EditDataProps> = ({ docId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultValues, setDefaultValues] = useState<DefaultValuesType | null>(null);

  useEffect(() => {
    const fetchWorkoutSchedule = async () => {
      if (!docId) return;
      try {
        const docRef = doc(db, "workoutSchedules", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setDefaultValues({
            date: data.date.toDate(), // Convert Firestore Timestamp to JavaScript Date
            workoutId: data.workoutId,
            intensity: data.intensity,
            icon: data.icon || "", // Ensure fields are provided with defaults or empty string if missing
            title: data.title || "",
            muscleType: data.muscleType || "",
            muscleGroup: data.muscleGroup || [],
          });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Failed to fetch workout schedule:", error);
      }
    };

    fetchWorkoutSchedule();
  }, [docId]);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      if (!docId) throw new Error("Document ID is missing.");

      const docRef = doc(db, "workoutSchedules", docId);

      // Ensure that the data conforms to the schema before proceeding
      const validatedData = FormSchema.parse(data);

      // Retrieve workout details based on workoutId
      const workoutDoc = await getDoc(doc(db, "workouts", validatedData.workoutId));
      if (!workoutDoc.exists()) {
        throw new Error("Workout not found");
      }

      const workoutData = workoutDoc.data();

      // Prepare the workout schedule object to be updated in Firestore
      const workoutScheduleUpdate = {
        date: validatedData.date,
        workoutId: validatedData.workoutId,
        intensity: validatedData.intensity,
        icon: workoutData.icon || "",
        title: workoutData.title || "",
        muscleType: workoutData.muscleType || "",
        muscleGroup: workoutData.muscles.map((muscle: any) => muscle.label) || [],
        updatedAt: Date.now(),
      };

      // Update the workout schedule document in Firestore
      await updateDoc(docRef, workoutScheduleUpdate);
      console.log("Workout schedule updated successfully!");
    } catch (error) {
      console.error("Failed to update workout schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!defaultValues) {
    return <p>Loading...</p>; // Show a loading state while fetching data
  }

  return (
    <WorkoutScheduleForm
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      defaultValues={defaultValues} // Pass the default values here
      submitButtonText="Update Workout Schedule"
      mode={false}
    />
  );
};

export default EditData;

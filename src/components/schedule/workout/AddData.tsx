import React, { useState } from "react";
import WorkoutScheduleForm, { FormSchema } from "./Form";
import { z } from "zod";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useSession } from "@clerk/nextjs";

const AddData = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { session } = useSession();

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
      setIsSubmitting(true);
      try {
        // Ensure that the data conforms to the schema before proceeding
        const validatedData = FormSchema.parse(data);
  
        // Retrieve workout details based on workoutId
        const workoutDoc = await getDoc(doc(db, "workouts", validatedData.workoutId));
        if (!workoutDoc.exists()) {
          throw new Error("Workout not found");
        }
  
        const workoutData = workoutDoc.data();
  
        // Prepare the workout schedule object to be added to Firestore
        const workoutSchedule = {
          date: validatedData.date,
          intensity: validatedData.intensity,
          icon: workoutData.icon || "",
          title: workoutData.title || "",
          muscleType: workoutData.muscleType || "",
          muscleGroup: workoutData.muscles.map((muscle: any) => muscle.label) || [],
          userID: session?.user.id,
          updatedAt: Date.now(),
        };
  
        // Add the workout schedule document to Firestore
        await addDoc(collection(db, "workoutSchedules"), workoutSchedule);
        console.log("Workout schedule added successfully!");
      } catch (error) {
        console.error("Failed to add workout schedule:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <WorkoutScheduleForm
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      defaultValues={{}}
      submitButtonText="Add Workout Schedule"
      mode={true}
    />
  );
};

export default AddData;

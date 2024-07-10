import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Plus } from "lucide-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

type UserGoal = {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
};

const FormSchema = z.object({
  calories: z.preprocess((val) => Number(val), z.number().min(0, { message: "Kcal must be a positive number." })),
  fat: z.preprocess((val) => Number(val), z.number().min(0, { message: "Fat must be a positive number." })),
  carbs: z.preprocess((val) => Number(val), z.number().min(0, { message: "Carbs must be a positive number." })),
  protein: z.preprocess((val) => Number(val), z.number().min(0, { message: "Proteins must be a positive number." })),
});

const UserGoalForm: React.FC = () => {
  const { session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      calories: 0,
      fat: 0,
      protein: 0,
      carbs: 0,
    },
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        try {
          const userGoalsDoc = doc(db, "goals", session.user.id);
          const userGoalsSnapshot = await getDoc(userGoalsDoc);
          if (userGoalsSnapshot.exists()) {
            form.reset(userGoalsSnapshot.data() as UserGoal);
          }
        } catch (error) {
          console.error("Error fetching user goals:", error);
        }
      }
    };
    fetchData();
  }, [session, form]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!session?.user) {
      console.error("Session is not properly initialized.");
      return;
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "goals", session.user.id), {
        ...formData,
        userID: session.user.id,
        updatedAt: Date.now(),
      });
      console.log("Goals saved successfully");
    } catch (error) {
      console.error("Error saving goals:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <Button asChild variant="outline" className="h-8 px-2">
        <DialogTrigger onClick={() => setIsOpen(true)}>
          <Plus size={16} />
        </DialogTrigger>
      </Button>
      {isOpen && (
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-row space-x-4">
                <FormField control={form.control} name="calories" render={({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Calories</FormLabel>
                    <Input placeholder="Calories" type="number" {...field} />
                    <FormMessage />
                  </div>
                )} />
                <FormField control={form.control} name="fat" render={({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Fat</FormLabel>
                    <Input placeholder="Fat" type="number" {...field} />
                    <FormMessage />
                  </div>
                )} />
              </div>
              <div className="flex flex-row space-x-4">
                <FormField control={form.control} name="protein" render={({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Protein</FormLabel>
                    <Input placeholder="Protein" type="number" {...field} />
                    <FormMessage />
                  </div>
                )} />
                <FormField control={form.control} name="carbs" render={({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Carbs</FormLabel>
                    <Input placeholder="Carbs" type="number" {...field} />
                    <FormMessage />
                  </div>
                )} />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Goals"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default UserGoalForm;

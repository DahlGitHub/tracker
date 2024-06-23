"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, CalendarIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useSession } from "@clerk/nextjs";

type DietItem = {
  carbs: number;
  fat: number;
  gram: number;
  kcal: number;
  proteins: number;
};

type Diet = {
  id: string;
  meal: string;
  name: string;
  icon: string;
  items: DietItem[];
};

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  breakfast: z.any(),
  lunch: z.any(),
  dinner: z.any(),
  supper: z.any()
});

const defaultMealDetails = {
  id: "",
  name: "None",
  icon: "",
  items: [
    {
      carbs: 0,
      fat: 0,
      gram: 0,
      kcal: 0,
      proteins: 0,
    },
  ],
};

const calculateTotals = (meals: Diet[]) => {
  return meals.reduce(
    (totals, meal) => {
      meal.items.forEach((item) => {
        totals.kcal += item.kcal;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
        totals.proteins += item.proteins;
      });
      return totals;
    },
    { kcal: 0, carbs: 0, fat: 0, proteins: 0 }
  );
};

const FoodForm = () => {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSession() ;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      breakfast: "",
      lunch: "",
      dinner: "",
      supper: "",
    },
  });

  useEffect(() => {
    const fetchDiets = async () => {
      if (!session) return;

      const dietsQuery = query(
        collection(db, "diet"),
        where("userID", "==", session?.user.id)
      );

      const querySnapshot = await getDocs(dietsQuery);
      const dietsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        icon: doc.data().icon,
        meal: doc.data().meal,
        items: doc.data().items,
      }));
      setDiets(dietsData);
    };

    fetchDiets();
  }, [session]);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      const getMealDetails = (mealId: string) => {
        const meal = diets.find((diet) => diet.id === mealId);
        return meal ? { id: meal.id, icon:meal.icon, name: meal.name, items: meal.items } : defaultMealDetails;
      };
      const breakfast = getMealDetails(data.breakfast);
      const lunch = getMealDetails(data.lunch);
      const dinner = getMealDetails(data.dinner);
      const supper = getMealDetails(data.supper);
      const meals: Diet[] = [
        { ...breakfast, meal: "breakfast" }, // Assuming "icon" should correspond to the meal type
        { ...lunch, meal: "lunch" },
        { ...dinner, meal: "dinner" },
        { ...supper, meal: "supper" },
      ];
      const totals = calculateTotals(meals);
      const formatNumber = (num: number) => parseFloat(num.toFixed(2));
      await addDoc(collection(db, "food"), {
        date: data.date,
        breakfast: getMealDetails(data.breakfast),
        lunch: getMealDetails(data.lunch),
        dinner: getMealDetails(data.dinner),
        supper: getMealDetails(data.supper),
        totalKcal: formatNumber(totals.kcal),
        totalCarbs: formatNumber(totals.carbs),
        totalFat: formatNumber(totals.fat),
        totalProteins: formatNumber(totals.proteins),
        updatedAt: Date.now(),
        userID: session?.user.id,
      });

      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
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
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-3">
                    <FormLabel>Date</FormLabel>
                    <Popover open={open}>
                      <PopoverTrigger asChild onClick={() => setOpen(!open)}>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        onClick={() => setOpen(!open)}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(["breakfast", "lunch", "dinner", "supper"] as const).map(
                (meal, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={meal}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  meal.charAt(0).toUpperCase() + meal.slice(1)
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diets
                              .filter(
                                (diet) => diet.meal.toLowerCase() === meal
                              )
                              .map((diet) => (
                                <SelectItem key={diet.id} value={diet.id}>
                                  {diet.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex flex-row">
                    <Loader2 className="mr-2 animate-spin my-0.5" size={16} />
                    Adding...
                  </span>
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default FoodForm;

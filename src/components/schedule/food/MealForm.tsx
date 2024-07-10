// components/MealForm.tsx

import React from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../../ui/calendar";
import { Diet } from "../../diet/DietData";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  breakfast: z.string().optional(),
  lunch: z.string().optional(),
  dinner: z.string().optional(),
  supper: z.string().optional(),
});

type MealFormProps = {
  diets: Diet[];
  isSubmitting: boolean;
  onSubmit: (data: z.infer<typeof FormSchema>) => Promise<void>;
  defaultValues: Partial<z.infer<typeof FormSchema>>;
  submitButtonText: string;
};

export const MealForm: React.FC<MealFormProps> = ({
  diets,
  isSubmitting,
  onSubmit,
  defaultValues,
  submitButtonText,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }: { field: any }) => (
            <FormItem className="flex flex-col pt-3">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
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
                <PopoverContent className="w-auto p-0">
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
              render={({ field }: { field: any }) => (
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
                        .filter((diet) => diet.meal.toLowerCase() === meal)
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
              {submitButtonText}
            </span>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </Form>
  );
};

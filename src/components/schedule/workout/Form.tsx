import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Edit, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../../ui/calendar";
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
  Form,
} from "@/components/ui/form";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useSession } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  workoutId: z.string().nonempty("Workout is required."),
  intensity: z.string().nonempty("Intensity is required."),
});

type WorkoutScheduleFormProps = {
  isSubmitting: boolean;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  defaultValues: Partial<z.infer<typeof FormSchema>>;
  submitButtonText: string;
  mode: boolean;
};

export const WorkoutScheduleForm: React.FC<WorkoutScheduleFormProps> = ({
  isSubmitting,
  onSubmit,
  defaultValues,
  submitButtonText,
  mode,
}) => {
  const { session } = useSession();
  const [workouts, setWorkouts] = useState<
    { id: string; title: string; icon: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      workoutId: "",
      intensity: "",
    
    },
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!session) return;

      const workoutsQuery = query(
        collection(db, "workouts"),
        where("userID", "==", session.user.id)
      );

      const querySnapshot = await getDocs(workoutsQuery);
      const workoutsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        icon: doc.data().icon,
        title: doc.data().title,
      }));
      setWorkouts(workoutsData);
    };

    fetchWorkouts();
  }, [session]);

  useEffect(() => {
    // Update the form default values when `defaultValues` prop changes
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Dialog>
      {mode == true ? (
        <Button asChild variant="outline" className="h-8 px-2">
          <DialogTrigger onClick={() => setIsOpen(true)}>
            <Plus size={16} />
          </DialogTrigger>
        </Button>
      ) : (
        <Button asChild variant="ghost" className="h-8 w-full px-2">
          <DialogTrigger onClick={() => setIsOpen(true)}>
            <Edit size={16} className="mr-2" />
            <div className="text-start w-full">Edit</div>
          </DialogTrigger>
        </Button>
      )}
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
                          {...field}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workoutId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Workout</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a workout" />
                        </SelectTrigger>
                        <SelectContent>
                          {workouts.map((workout) => (
                            <SelectItem key={workout.id} value={workout.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="hidden h-8 w-8 sm:flex border p-1 border-zinc-600">
                                  <AvatarImage
                                    src={workout.icon}
                                    alt="Avatar"
                                  />
                                </Avatar>
                                {workout.title}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intensity</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </DialogContent>
      )}
    </Dialog>
  );
};

export default WorkoutScheduleForm;

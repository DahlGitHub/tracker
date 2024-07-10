import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { collection, doc, updateDoc } from "firebase/firestore";
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
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Edit, Loader2 } from "lucide-react";
import { Workout } from "./WorkoutData";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { iconOptions } from "@/lib/icons";
import MultipleSelector, { Option } from "../ui/multiple-selector";
import { exerciseOptions } from "@/lib/exercises";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

interface EditDataProps {
  data: Workout;
  docId: string;
}

const OPTIONS: Option[] = [
  { value: "Arms", label: "Arms" },
  { value: "Abs", label: "Abs" },
  { value: "Legs", label: "Legs" },
  { value: "Chest", label: "Chest" },
  { value: "Shoulders", label: "Shoulders" },
  { value: "Back", label: "Back" },
];

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be no longer than 100 characters." }),
  icon: z.string().min(1, { message: "Icon is required." }),
  muscles: z.array(optionSchema, {
    message: "At least one muscle is required.",
  }),
  muscleType: z.string().min(1, { message: "Muscle Type is required." }),
  exercises: z.array(optionSchema, {
    message: "At least one exercise is required.",
  }),
});

export const EditProgram = React.forwardRef<HTMLDivElement, EditDataProps>(
  ({ docId, data }) => {
    EditProgram.displayName = "EditProgram";
    const [currentData, setCurrentData] = React.useState(data);
    const [iconOptions, setIconOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
      defaultValues: {
        title: currentData.title,
        icon: currentData.icon,
        muscles: currentData.muscles,
        muscleType: currentData.muscleType,
        exercises: currentData.exercises,
      },
      resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
      const fetchIcons = async () => {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "gs://tracker-d2773.appspot.com/images/musclegroups/"
        );
        const iconList = await listAll(storageRef);
        const iconUrls = await Promise.all(
          iconList.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setIconOptions(iconUrls);
      };

      fetchIcons();
    }, []);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
      setIsSubmitting(true);

      try {
        await updateDoc(doc(db, "workouts", docId), {
          ...formData,
          updatedAt: Date.now(),
        });
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
      setIsSubmitting(false);
    }

    return (
      <Dialog>
        <Button asChild variant="ghost" className="h-8 w-full px-2">
          <DialogTrigger onClick={() => setIsOpen(true)}>
            <Edit size={16} className="mr-2" />
            <div className="text-start w-full">Edit</div>
          </DialogTrigger>
        </Button>

        {isOpen && (
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex flex-row space-x-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((iconUrl, index) => (
                                <SelectItem key={index} value={iconUrl}>
                                  <img
                                    src={iconUrl}
                                    alt={`icon-${index}`}
                                    className="h-6 w-6"
                                  />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="muscles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muscle Groups</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          badgeClassName="bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                          options={OPTIONS}
                          placeholder="Select a muscle group"
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              no results found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="muscleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a workout type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Strength", "Cardio"].map((muscleType, index) => (
                              <SelectItem key={index} value={muscleType}>
                                {muscleType}
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
                  name="exercises"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercises</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          defaultOptions={exerciseOptions.map((exercise) => ({
                            label: exercise.label,
                            value: exercise.value,
                          }))}
                          badgeClassName="bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                          placeholder="Select or type a custom exercise"
                          creatable
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              no results found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex flex-row">
                      <Loader2 className="mr-2 animate-spin my-0.5" size={16} />
                      Updating...
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
  }
);

export default EditProgram;

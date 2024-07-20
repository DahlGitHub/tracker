import React, { useState } from "react";
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
import { Program } from "./ProductsData";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { iconOptions } from "@/lib/icons";

interface EditDataProps {
  data: Program;
  docId: string;
}

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be no longer than 100 characters." }),
  icon: z.string().min(1, { message: "Icon is required." }),
  kcal: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Kcal must be a positive number." })
  ),
  fat: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Fat must be a positive number." })
  ),
  carbs: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Carbs must be a positive number." })
  ),
  proteins: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Proteins must be a positive number." })
  ),
  status: z.string().nonempty({ message: "Status is required." }),
});

export const EditProgram = React.forwardRef<HTMLDivElement, EditDataProps>(
  ({ docId, data }) => {
    EditProgram.displayName = "EditProgram";
    const [currentData, setCurrentData] = React.useState(data);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
      defaultValues: {
        title: currentData.title,
        icon: currentData.icon,
        kcal: currentData.kcal,
        fat: currentData.fat,
        carbs: currentData.carbs,
        proteins: currentData.proteins,
        status: currentData.status,
      },
      resolver: zodResolver(FormSchema),
    });

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
      setIsSubmitting(true);

      try {
        await updateDoc(doc(db, "products", docId), {
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Icon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <option.icon className="h-4 w-4 mr-2" />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row space-x-4">
                  <FormField
                    control={form.control}
                    name="kcal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kcal</FormLabel>
                        <FormControl>
                          <Input placeholder="Kcal" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fat</FormLabel>
                        <FormControl>
                          <Input placeholder="Fat" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-row space-x-4">
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs</FormLabel>
                        <FormControl>
                          <Input placeholder="Carbs" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proteins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proteins</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Proteins"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
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
                    "Update"
                  )}
                </Button>
              </form>
            </Form>

            <DialogTrigger onClick={() => setIsOpen(false)}>
              Cancel
            </DialogTrigger>
          </DialogContent>
        )}
      </Dialog>
    );
  }
);

export default EditProgram;

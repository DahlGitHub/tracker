import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
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
import { useForm, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Trash } from "lucide-react";
import { categoryOptions, iconOptions } from "@/lib/icons";
import { useSession } from "@clerk/nextjs";

type Product = {
  id: string;
  title: string;
  kcal: number;
  fat: number;
  carbs: number;
  proteins: number;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be no longer than 100 characters." }),
  meal: z.string().min(1, { message: "Meal is required." }),
  icon: z.string().min(1, { message: "Icon is required." }),
  items: z
    .array(
      z.object({
        product: z.string().min(1, { message: "Product is required." }),
        gram: z.preprocess(
          (val) => Number(val),
          z.number().min(0, { message: "Gram must be a positive number." })
        ),
      })
    )
    .nonempty({ message: "At least one product is required." }),
});

const formatNumber = (num: number) => parseFloat(num.toFixed(2));

const NewDietForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      meal: "",
      icon: "",
      items: [{ product: "", gram: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session) return;

      const q = query(
        collection(db, "products"),
        where("userID", "==", session?.user.id),
        where("status", "==", "Active")  // Additional condition for active status
      );
      const querySnapshot = await getDocs(q);
      const productsData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        kcal: doc.data().kcal,
        fat: doc.data().fat,
        carbs: doc.data().carbs,
        status: doc.data().status,
        proteins: doc.data().proteins,
      }));
      setProducts(productsData);
    };

    fetchProducts();
  }, [session]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      const itemsWithNutrition = data.items.map((item) => {
        const product = products.find((p) => p.id === item.product);
        if (product) {
          return {
            ...item,
            kcal: formatNumber(product.kcal * (item.gram / 100)), // Calculate kcal based on gram
            fat: formatNumber(product.fat * (item.gram / 100)), // Calculate fat based on gram
            carbs: formatNumber(product.carbs * (item.gram / 100)), // Calculate carbs based on gram
            proteins: formatNumber(product.proteins * (item.gram / 100)), // Calculate proteins based on gram
            title: product.title,
          };
        } else {
          return item;
        }
      });

      await addDoc(collection(db, "diet"), {
        ...data,
        items: itemsWithNutrition,
        userID: session?.user.id,
        status: "Active",
        updatedAt: Date.now(),
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = (index: number) => {
    if (fields.length > 1) {
      remove(index);
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Meal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <option.icon className="h-4 w-4 mr-2" />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-row space-x-4 items-center"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.product`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.gram`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gram</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Gram"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="pt-2"
                        onClick={() => handleRemove(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="pt-2"
                  onClick={() => append({ product: "", gram: 0 })}
                >
                  Add Product
                </Button>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} variant="secondary">
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

export default NewDietForm;

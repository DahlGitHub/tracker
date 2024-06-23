import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { iconOptions } from '@/lib/icons'; // Import the icon options
import { useSession } from '@clerk/nextjs';

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }).max(100, { message: 'Title must be no longer than 100 characters.' }),
  icon: z.string().min(1, { message: 'Icon is required.' }),
  kcal: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Kcal must be a positive number.' })),
  fat: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Fat must be a positive number.' })),
  carbs: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Carbs must be a positive number.' })),
  proteins: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Proteins must be a positive number.' })),
});

export const AddProgram = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...data,
        status: 'Active',
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
        <DialogTrigger
          onClick={() => {
            setIsOpen(true);
          }}
        >
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
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {iconOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
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
                        <Input placeholder="Proteins" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex flex-row">
                    <Loader2 className="mr-2 animate-spin my-0.5" size={16} />
                    Adding...
                  </span>
                ) : (
                  'Add'
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddProgram;

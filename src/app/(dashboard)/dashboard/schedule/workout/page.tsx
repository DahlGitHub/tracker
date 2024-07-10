"use client";

import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DataTable,
  WorkoutSchedule,
  columns,
} from "@/components/schedule/workout/Data";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../../../firebase";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  WorkoutScheduleForm,
  FormSchema,
} from "@/components/schedule/workout/Form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { TableSkeleton } from "@/components/TableSkeleton";

export default function ProductsPage() {
  const [data, setData] = useState<WorkoutSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    const fetchProductsData = async () => {
      if (session && session.user) {
        try {
          const q = query(
            collection(db, "workoutSchedules"),
            where("userID", "==", session?.user.id)
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newData = snapshot.docs.map(
              (doc) =>
                ({
                  docId: doc.id,
                  ...doc.data(),
                } as WorkoutSchedule)
            );

            setData(newData);
            
            setIsLoading(false);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching products data:", error);
        }
      }
    };

    fetchProductsData();
  }, [session]);

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">
              Schedule
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="rounded-lg border-none mt-6 bg-zinc-900">
        <CardContent className="p-6">
          {
          isLoading ? (
            <TableSkeleton columnCount={columns.length} />
          ) : (

          <DataTable columns={columns} data={data} />
          )}
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

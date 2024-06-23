"use client";

import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DataTable, Food, columns } from "@/components/food/FoodData";
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
} from "firebase/firestore";
import { db } from "../../../../../../firebase";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@clerk/nextjs";

export default function ProductsPage() {
  const [data, setData] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    const fetchProductsData = async () => {
      if (session && session.user) {
        try {
          const q = query(
            collection(db, "food"),
            where("userID", "==", session?.user.id)
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newData = snapshot.docs.map(
              (doc) =>
                ({
                  docId: doc.id,
                  ...doc.data(),
                } as Food)
            );

            setData(newData);
            setIsLoading(false);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching products data:", error);
          setIsLoading(false);
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
            <BreadcrumbPage>Food</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="rounded-lg border-none mt-6 bg-zinc-900">
        <CardContent className="p-6">
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProgressSection from "@/components/dashboard/ProgressSection";
import { Card, CardContent } from "@/components/ui/card";
import RecentFoodTable from "@/components/dashboard/RecentFoodTable";
import RecentWorkoutTable from "@/components/dashboard/RecentWorkoutData";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../../firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@clerk/nextjs";
import Barchart from "@/components/dashboard/Barchart";
import RecentWorkoutData from "@/components/dashboard/RecentWorkoutData";
import TopWorkoutData from "@/components/dashboard/TopWorkoutData";
import Radarchart from "@/components/dashboard/Radarchart";
import { DatePicker } from "@/components/dashboard/DatePicker";
import ProfileCard from "@/components/dashboard/ProfileCard";
import Linechart from "@/components/dashboard/Linechart";
import BarchartTwo from "@/components/dashboard/BarchartTwo";
import FoodSearch from "@/components/FoodSearch";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { session } = useSession();

  /*
  useEffect(() => {
    const signInWithClerk = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const token = await getToken({ template: "integration_firebase" });
          if (token) {
            await signInWithCustomToken(auth, token);
          }
        } catch (error) {
          console.error("Error signing in with custom token:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    signInWithClerk();
  }, [isLoaded, isSignedIn, getToken]);
  */

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
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-6 bg-zinc-900 rounded-lg">
          <Tabs defaultValue="overview">
            <div className="flex flex-row gap-2">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <DatePicker
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />
              
            </div>
            <TabsContent value="overview">
              <div className="pt-4 flex flex-row gap-4">
                <div className="w-3/4">
                  <ProgressSection selectedDate={selectedDate} />
                  <div className="grid gap-4">
                    <Barchart />

                    <Linechart />
                  </div>
                </div>
                <div className="w-1/4">
                  <ProfileCard />
                  <Radarchart />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="table">
              <div className="pt-4 flex flex-row gap-4">
                <div className="w-3/4">
                  <RecentFoodTable />
                </div>
                <div className="w-1/4">
                  <RecentWorkoutData />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

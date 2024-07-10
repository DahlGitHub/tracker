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
          <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />

          <div className="pt-4 flex flex-row gap-4">
            <div className="w-3/4">
              <ProgressSection selectedDate={selectedDate} />
              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <RecentFoodTable />
                </TabsContent>
                <TabsContent value="chart">
                  <Barchart />
                </TabsContent>
              </Tabs>
              <Linechart />
            </div>
            <div className="w-1/4">
              <ProfileCard />
              <Tabs defaultValue="recent">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="radar">Radar</TabsTrigger>
                  <TabsTrigger value="top" disabled>Top</TabsTrigger>
                </TabsList>
                <TabsContent value="recent">
                  <RecentWorkoutData />
                </TabsContent>
                <TabsContent value="radar">
                  <Radarchart />
                </TabsContent>
                <TabsContent value="top">
                  <TopWorkoutData />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

"use client";

import Link from "next/link";

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
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Card, CardContent } from "@/components/ui/card";


import { useFetchWorkoutData } from "@/components/hevy/FetchData";
import { columns, DataTable } from "../../../../components/hevy/WorkoutTable";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { TableSkeleton } from "@/components/TableSkeleton";
import SetApiKeyForm from "@/components/hevy/SetApiKeyForm";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { workoutData, loading, error, page_count: pageCount } = useFetchWorkoutData(currentPage);


  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(pageCount);
  };

  return (
    <ContentLayout title="Hevy">
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
            <BreadcrumbPage>Hevy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="rounded-lg border-none mt-6 bg-zinc-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <h1 className="text-sm font-medium">Adrians workouts</h1>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {pageCount}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className={`h-8 w-8 p-0 ${currentPage === 1 && "opacity-50"}`}
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className={`h-8 w-8 p-0 ${currentPage === 1 && "opacity-50"}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className={`h-8 w-8 p-0 ${
                    currentPage === pageCount && "opacity-50"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === pageCount}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className={`h-8 w-8 p-0 ${
                    currentPage === pageCount && "opacity-50"
                  }`}
                  onClick={handleLastPage}
                  disabled={currentPage === pageCount}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                <span className="text-xs text-red-600">NB: Individual API fetching coming soon...</span>
              </div>
            </div>
          </div>
          {loading ? (
            <TableSkeleton columnCount={4} />
          ) : error ? (
            <div>
              <p className="text-red-500">{error}</p>
              <SetApiKeyForm />
            </div>
          ) : (
            <DataTable columns={columns} data={workoutData} />
          )}
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

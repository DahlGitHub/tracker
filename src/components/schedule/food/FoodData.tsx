"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  ArrowUpDown,
  ImagePlus,
  LinkIcon,
  IceCream,
  PiIcon,
  CherryIcon,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import moment from "moment";
import DeleteRow from "@/components/table/DeleteRow";

import EditDiet from "./EditFood";
import { ProgramToolbar } from "./FoodToolbar";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { Timestamp } from "firebase/firestore";
import { Badge } from "../../ui/badge";
import { iconOptions, IconOption } from "@/lib/icons";
import MealCell from "../../MealCell";

interface MealCellProps {
  mealName: string;
  iconName: string;
}

export type MealItem = {
  product: string;
  gram: number;
  kcal: number;
  fat: number;
  proteins: number;
  carbs: number;
};

export type Meal = {
  icon: string;
  id: string;
  name: string;
  items: MealItem[];
};

export type Food = {
  docId: string;
  date: Timestamp;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  supper: Meal;
  totalKcal: number;
  totalCarbs: number;
  totalFat: number;
  totalProteins: number;
};

export const columns: ColumnDef<Food>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const data = row.original;
      const formattedDate = moment(data.date.seconds * 1000).format(
        "ddd, D. MMM"
      );
      return <div className="py-1 text-xs">{formattedDate}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "breakfast",
    header: "Breakfast",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <MealCell
          mealName={data.breakfast.name}
          iconName={data.breakfast.icon}
        />
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "lunch",
    header: "Lunch",
    cell: ({ row }) => {
      const data = row.original;
      return <MealCell mealName={data.lunch.name} iconName={data.lunch.icon} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "dinner",
    header: "Dinner",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <MealCell mealName={data.dinner.name} iconName={data.dinner.icon} />
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "supper",
    header: "Supper",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <MealCell mealName={data.supper.name} iconName={data.supper.icon} />
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "kcal",
    header: "Calories",
    cell: ({ row }) => <div>{row.original.totalKcal}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "carbs",
    header: "Carbs (g)",
    cell: ({ row }) => <div>{row.original.totalCarbs}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "fat",
    header: "Fat (g)",
    cell: ({ row }) => <div>{row.original.totalFat}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "proteins",
    header: "Proteins (g)",

    cell: ({ row }) => <div>{row.original.totalProteins}</div>,
    enableHiding: false,
  },
  {
    id: "actions",

    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="space-y-1">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <EditDiet data={row.original} docId={row.original.docId} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteRow
                docId={row.original.docId}
                collectionName={"food"}
                message={`Are you sure you want to delete ${row.getValue(
                  "date"
                )}?`}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      author: false,
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div>
      <ProgramToolbar table={table} />
      <div className="rounded-md border bg-zinc-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

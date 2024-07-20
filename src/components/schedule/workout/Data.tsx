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

import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { Timestamp } from "firebase/firestore";
import { Badge } from "../../ui/badge";
import { iconOptions, IconOption } from "@/lib/icons";
import MealCell from "../../MealCell";
import EditData from "./EditData";
import { ProgramToolbar } from "./DataToolbar";
import IntensityDisplay from "@/components/IntensityDisplay";
import { Avatar, AvatarImage } from "@/components/ui/avatar";


export type WorkoutSchedule = {
  docId: string;
  date: Timestamp;
  title: string;
  icon: string;
  muscleType: string;
  muscleGroup: string[];
  intensity: string;
};

export const columns: ColumnDef<WorkoutSchedule>[] = [
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
    accessorKey: "title",
    header: "Workout",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="hidden h-8 w-8 sm:flex border p-1 border-zinc-600">
            <AvatarImage src={data.icon} alt="Avatar" />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-semibold leading-none">{data.title}</p>
            <p className="text-xs text-gray-500">{data.muscleType}</p>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },

  {
    accessorKey: "muscleGroup",
    header: "Muscle Group",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          {row.original.muscleGroup.map((muscle, index) => (
            <Badge variant="secondary" key={index}>{muscle}</Badge>
          ))}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "intensity",
    header: "Intensity",
    cell: ({ row }) => {
      return (
        <IntensityDisplay intensity={row.original.intensity} />
      )
    },
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
     
      
            <EditData docId={row.original.docId} />
 
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteRow
                docId={row.original.docId}
                collectionName={"workoutSchedules"}
                message={`Are you sure you want to delete ${row.getValue(
                  "title"
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

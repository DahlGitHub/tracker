"use client";

import React from "react";
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
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { ExercisesPopover } from "../ExercisesPopover";
import { HevyPopover } from "../HevyPopover";

export interface Set {
  index: number;
  set_type: string;
  weight_kg: number | null;
  reps: number | null;
  distance_meters: number | null;
  duration_seconds: number | null;
  rpe: number | null;
}

export interface Exercise {
  index: number;
  title: string;
  notes: string;
  exercise_template_id: string;
  superset_id: number;
  sets: Set[];
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  created_at: string;
  exercises: Exercise[];
}

export interface WorkoutData {
  page: number;
  page_count: number;
  workouts: Workout[];
}

export const columns: ColumnDef<Workout>[] = [
  {
    accessorKey: "start_time",
    header: "Date",
    cell: ({ row }) => {
      const data = row.original;
      const formattedDate = moment(data.start_time).format(
        "ddd, D. MMM YYYY, h:mm A"
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
          <div className="grid gap-1">
            <p className="text-sm font-semibold leading-none">{data.title}</p>
            <p className="text-xs text-gray-500">{data.description}</p>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "exercises",
    header: "Exercises",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          <HevyPopover
            exercises={row.original.exercises.map((exercise) => ({
              title: exercise.title,
              superset_id: exercise.superset_id,
              sets: exercise.sets.map((set) => ({
                reps: set.reps || 0,
                weight_kg: set.weight_kg || 0,
                set_type: set.set_type,
              })),
            }))}
          />
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const data = row.original;
      const duration = moment(data.end_time).diff(
        moment(data.start_time),
        "minutes"
      );
      return <div className="py-1 text-xs">{duration} minutes</div>;
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
    React.useState<VisibilityState>({});

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
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

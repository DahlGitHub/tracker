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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import DeleteRow from "@/components/table/DeleteRow";
import { Badge } from "../ui/badge";
import EditProgram from "./EditWorkout";
import { ProgramToolbar } from "./WorkoutToolbar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type Workout = {
  docId: string;
  title: string;
  icon: string;
  muscles: { label: string; value: string }[];
  muscleType: string;
  exercises: { label: string; value: string }[];
  status: string;
  updatedAt: number;
};

const ExercisesPopover = ({
  exercises,
}: {
  exercises: { label: string; value: string }[];
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="flex items-center">
        {exercises.slice(0, 3).map((exercise, index) => (
          <Avatar
            key={index}
            className="h-8 w-8 bg-zinc-800 border p-1 border-zinc-600 -ml-2 first:ml-0"
          >
            <AvatarImage
              src={
                exercise.value.startsWith("http")
                  ? exercise.value
                  : "https://cdn-icons-png.flaticon.com/512/4072/4072281.png"
              }
              alt={exercise.label}
            />
            <AvatarFallback>{exercise.label.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        {exercises.length > 3 && (
          <Avatar className="h-6 w-6 border p-1 bg-zinc-800 border-zinc-600 -ml-2">
            <AvatarFallback>+{exercises.length - 3}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </PopoverTrigger>
    <PopoverContent>
      <div className="flex flex-col items-start gap-2">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="flex items-center gap-2 my-1 w-full hover:bg-zinc-900"
          >
            <Avatar className="h-10 w-10 bg-zinc-800 border p-1 border-zinc-600">
              {exercise.value.startsWith("http") ? (
                <AvatarImage src={exercise.value} alt={exercise.label} />
              ) : (
                <AvatarFallback>{exercise.label.charAt(0)}</AvatarFallback>
              )}
              <AvatarImage
                src={
                  exercise.value.startsWith("http")
                    ? exercise.value
                    : "https://cdn-icons-png.flaticon.com/512/4072/4072281.png"
                }
                alt={exercise.label}
              />
              <AvatarFallback>{exercise.label.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{exercise.label}</span>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

export const columns: ColumnDef<Workout>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-10 w-10 sm:flex border p-1 border-zinc-600">
            <AvatarImage src={data.icon} alt="Avatar" />
            <AvatarFallback>SD</AvatarFallback>
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
    header: "Muscle Group(s)",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {data.muscles.map((muscle, index) => (
            <Badge key={index}>{muscle.label}</Badge>
          ))}
        </div>
      );
    },
    enableHiding: false,
  },

  {
    accessorKey: "exercises",
    header: "Exercises",
    cell: ({ row }) => {
      const data = row.original;
      return <ExercisesPopover exercises={data.exercises} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2" size={16} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="ml-2 flex items-center">
            {data.status == 'Active' ? (
                <Badge className="text-xs bg-green-100">
                    <span className='text-green-700'>{data.status}</span>
                </Badge>
            ) : (
                <Badge variant='secondary' className="text-xs">
                    <span className='text-gray-600'>{data.status}</span>
                </Badge>
            )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
              <EditProgram data={row.original} docId={row.original.docId} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteRow
                docId={row.original.docId}
                collectionName={"workouts"}
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

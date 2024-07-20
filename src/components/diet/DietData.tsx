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
  Check,
  X,
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

import DeleteRow from "@/components/table/DeleteRow";

import { Badge } from "../ui/badge";
import EditDiet from "./EditDiet";
import { ProgramToolbar } from "./DietToolbar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  CategoryOption,
  IconOption,
  categoryOptions,
  iconOptions,
} from "@/lib/icons";
import { Avatar } from "../ui/avatar";

export type Diet = {
  id: any;
  docId: string;
  name: string;
  icon: string;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Supper";
  items: {
    productId: string;
    gram: number;
    kcal: number;
    fat: number;
    proteins: number;
    title: string;
    carbs: number;
  }[];
  status: string;
  updatedAt: number;
};

const getIconOptions = (icon: string): IconOption | undefined => {
  return iconOptions.find((option) => option.value === icon);
};

const formatNumber = (num: number) => parseFloat(num.toFixed(2));

const calculateTotals = (diet: { items: any[] }) => {
  let totalKcal = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  let totalProteins = 0;

  diet.items.forEach((item) => {
    totalKcal += item.kcal;
    totalFat += item.fat;
    totalCarbs += item.carbs;
    totalProteins += item.proteins;
  });

  return {
    totalKcal: formatNumber(totalKcal),
    totalFat: formatNumber(totalFat),
    totalCarbs: formatNumber(totalCarbs),
    totalProteins: formatNumber(totalProteins),
  };
};

const DietPopover = ({
  items,
  name,
}: {
  items: { title: string; gram: number; kcal: number; fat: number; carbs: number; proteins: number }[];
  name: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="flex items-center">
        {items.slice(0, 3).map((item, index) => (
          <Avatar
            key={index}
            className="h-8 w-8 bg-zinc-800 border p-1 border-zinc-600 -ml-2 first:ml-0 flex items-center justify-center"
          >
            <CherryIcon className="h-4 w-4 text-white" />
          </Avatar>
        ))}
        {items.length > 3 && (
          <Avatar className="h-6 w-6 border p-1 bg-zinc-800 border-zinc-600 -ml-2 flex items-center justify-center">
            <span className="text-xs text-white">+{items.length - 3}</span>
          </Avatar>
        )}
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-full">
      <div className="flex flex-col items-start">
        <span className="font-bold">{name}</span>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="p-1 w-[125px]">Item</TableHead>
              <TableHead className="p-1 w-[75px]">Gram</TableHead>
              <TableHead className="p-1 w-[75px]">Calories</TableHead>
              <TableHead className="p-1 w-[75px]">Fat</TableHead>
              <TableHead className="p-1 w-[75px]">Carbs</TableHead>
              <TableHead className="p-1 w-[75px]">Proteins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} className="hover:bg-zinc-900">
                <TableCell className="p-1">{item.title}</TableCell>
                <TableCell className="p-1">{item.gram}</TableCell>
                <TableCell className="p-1">{item.kcal}</TableCell>
                <TableCell className="p-1">{item.fat}</TableCell>
                <TableCell className="p-1">{item.carbs}</TableCell>
                <TableCell className="p-1">{item.proteins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PopoverContent>
  </Popover>
);

export const columns: ColumnDef<Diet>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original;
      const iconOptions = getIconOptions(data.icon);
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="p-1.5">
            {iconOptions?.icon && <iconOptions.icon className="h-4 w-4" />}
          </Badge>
          <div className="grid gap-1">
            <p className="text-sm font-medium">{data.name}</p>
            <p className="text-xs text-gray-500">{data.meal}</p>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "kcal",
    header: "Calories",
    cell: ({ row }) => {
      const data = row.original;
      const totals = calculateTotals(data);
      return (
        <div className="flex flex-col items-start">
          <span>{totals.totalKcal}</span>
        </div>
      );
    },
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "fat",
    header: "Fat (g)",
    cell: ({ row }) => {
      const data = row.original;
      const totals = calculateTotals(data);
      return (
        <div className="flex flex-col items-start">
          <span>{totals.totalFat}</span>
        </div>
      );
    },

    enableHiding: false,
    size: 50,
  },

  {
    accessorKey: "carbs",
    header: "Carbs (g)",
    cell: ({ row }) => {
      const data = row.original;
      const totals = calculateTotals(data);
      return (
        <div className="flex flex-col items-start">
          <span>{totals.totalCarbs}</span>
        </div>
      );
    },
    size: 50,
    enableHiding: false,
  },

  {
    accessorKey: "protein",
    header: "Proteins (g)",
    cell: ({ row }) => {
      const data = row.original;
      const totals = calculateTotals(data);
      return (
        <div className="flex flex-col items-start">
          <span>{totals.totalProteins}</span>
        </div>
      );
    },
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "items",
    header: "Products",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-start">
          <DietPopover items={data.items} name={data.name} />
        </div>
      );
    },
    enableHiding: false,
    size: 200,
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2" size={16} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="ml-2 flex">
          {data.status == "Active" ? (
            <Badge
              variant="secondary"
              className="text-xs bg-green-800 bg-opacity-30 gap-1 items-center"
            >
              <Check className="h-3.5 w-3.5 text-green-700" />
              <span className="text-green-700">{data.status}</span>
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs bg-red-800 bg-opacity-30 gap-1 items-center"
            >
              <X className="h-3.5 w-3.5 text-red-500" />
              <span className="text-red-500">{data.status}</span>
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
            {/*
                           <DropdownMenuItem
                    onClick={() => handleDeleteEmail(row.getValue("email"))}>
                        Delete
                </DropdownMenuItem>
                 */}

            <DropdownMenuItem asChild>
              <EditDiet data={row.original} docId={row.original.docId} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteRow
                docId={row.original.docId}
                collectionName={"diet"}
                message={`Are you sure you want to delete ${row.getValue(
                  "name"
                )}?`}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 50,
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
                    <TableCell
                      // Added for column width
                      style={{
                        width: cell.column.getSize(),
                      }}
                      key={cell.id}
                    >
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

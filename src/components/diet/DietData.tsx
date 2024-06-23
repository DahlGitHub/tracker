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
import { CategoryOption, IconOption, categoryOptions, iconOptions } from "@/lib/icons";

export type Diet = {
  docId: string;
  name: string;
  icon: string;
  meal: "breakfast" | "lunch" | "dinner" | "supper";
  items: {
    productId: string;
    gram: number;
    kcal: number;
    fat: number;
    proteins: number;
    title: string;
    carbs: number;
  }[];
  updatedAt: number;
};

const getCategoryOption = (meal: string): CategoryOption | undefined => {
  return categoryOptions.find((option) => option.value === meal);
};

const getIconOptions = (icon: string): IconOption | undefined => {
  return iconOptions.find((option) => option.value === icon);
}

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

export const columns: ColumnDef<Diet>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original;
      const iconOptions = getIconOptions(data.icon);
      return (
        <div className="flex items-center">
          <Badge variant="secondary" className='p-1.5'>
          {iconOptions?.icon && (
              <iconOptions.icon className="h-4 w-4" />
            )}
          </Badge>
          <span className="pl-2">{data.name}</span>
        </div>
      );
    },
    size: 300,
    enableHiding: false,
  },
  {
    accessorKey: "meal",
    header: "Meal",
    cell: ({ row }) => {
      const data = row.original;
      const categoryOption = getCategoryOption(data.meal);
      return (
        <div className="flex items-start">
          <Badge
            variant="secondary"
            className={`px-2 py-1 ${categoryOption?.color}`}
          >
            {categoryOption?.icon && (
              <categoryOption.icon className="h-4 w-4" />
            )}
            <span className="pl-1">{categoryOption?.label}</span>
          </Badge>
        </div>
      );
    },
    size: 300,
    enableHiding: false,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-start">
          {data.items.map((item, index) => {
            // Find the product corresponding to the item

            return (
              <Popover key={index}>
                <PopoverTrigger>
                  <CherryIcon className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-1">
                    {item.title}
                    <p>Gram: {item.gram}</p>

                    <p>Calories: {item.kcal} </p>
                    <p>Fat: {item.fat} </p>
                    <p>Carbs: {item.carbs} </p>
                    <p>Proteins: {item.proteins} </p>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      );
    },
    size: 290,
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
    size: 200,
    enableHiding: false,
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
    size: 125,
    enableHiding: false,
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
    size: 125,
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
    size: 125,
  },

  {
    id: "actions",
    size: 50,
    
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
        <Table
          // Added for column width
          {...{
            style: {
              width: table.getCenterTotalSize(),
            },
          }}
        >
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

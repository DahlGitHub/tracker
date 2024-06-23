'use client';

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
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, ArrowUpDown, ImagePlus, LinkIcon, IceCream, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';

import DeleteRow from '../DeleteRow';

import { Badge } from '../ui/badge';
import EditProgram from './EditProducts';
import { ProgramToolbar } from './ProductsToolbar';
import { iconOptions, IconOption } from '@/lib/icons';

export type Program = {
  docId: string;
  title: string;
  icon: string;
  kcal: number;
  fat: number;
  carbs: number
  proteins: number;
  status: string;
  updatedAt: number;
};

const getIconOptions = (icon: string): IconOption | undefined => {
  return iconOptions.find((option) => option.value === icon);
};

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: 'title',
    header: 'Product (100g serving)',
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
          <span className='pl-2'>{data.title}</span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'kcal',
    header: 'Calories',
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col items-start">
          <span>{data.kcal}</span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'fat',
    header: 'Fat (g)',
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col items-start">
          <span>{data.fat}</span>
        </div>
      );
    },
    enableHiding: false,
  },

  {
    accessorKey: 'carbs',
    header: 'Carbs (g)',
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col items-start">
          <span>{data.carbs}</span>
        </div>
      );
    },
    enableHiding: false,
  },

  {
    accessorKey: 'protein',
    header: 'Proteins (g)',
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col items-start">
          <span>{data.proteins}</span>
        </div>
      );
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
    id: 'actions',
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
              <EditProgram data={row.original} docId={row.original.docId} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteRow
                docId={row.original.docId}
                collectionName={'products'}
                message={`Are you sure you want to delete ${row.getValue(
                  'title',
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
    [],
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
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}> 
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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



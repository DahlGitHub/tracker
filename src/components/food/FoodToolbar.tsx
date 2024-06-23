import { Table } from '@tanstack/react-table';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Eye } from 'lucide-react';
import DeleteCollection from '@/components/table/DeleteCollection';
import AddFood from './AddFood';
import { FacetedFilter } from '@/components/table/FacetedFilter';

interface ProgramToolbarProps<TData> {
  table: Table<TData>;
}

export function ProgramToolbar<TData>({ table }: ProgramToolbarProps<TData>) {


  return (
    <div className="flex flex-col sm:flex-row justify-between py-4">
      <div className="flex flex-1">


      </div>

      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 px-2">
              <Eye size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <AddFood />
        <DeleteCollection collectionName={'programdata'} />
      </div>
    </div>
  );
}

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
import DeleteCollection from '../DeleteCollection';
import AddProgram from './AddDiet';
import { FacetedFilter } from '../FacetedFilter';

interface ProgramToolbarProps<TData> {
  table: Table<TData>;
}

export function ProgramToolbar<TData>({ table }: ProgramToolbarProps<TData>) {


  return (
    <div className="flex flex-col sm:flex-row justify-between py-4">
      <div className="flex flex-1">
        <Input
          placeholder="Search name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 px-2 w-50 mr-2"
        />


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

        <AddProgram />
        <DeleteCollection collectionName={'diet'} />
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';

interface TableHeaderProps {
  columnCount: number;
}

export const TableSkeleton: React.FC<TableHeaderProps> = ({ columnCount }) => {
  const columnWidths = ['100px', '75px', '50px']; // Array of three different column widths

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-end py-4">
        <div className='flex space-x-2 '>
        <Button variant="outline" className="h-8 w-8 px-2 bg-zinc-950" >
          <Skeleton className="w-[100%] h-[20px] rounded-full" />
        </Button>
        <Button variant="outline" className="h-8 w-8 px-2 bg-zinc-950" >
          <Skeleton className="w-[100%] h-[20px] rounded-full" />
        </Button>
        <Button variant="outline" className="h-8 w-8 px-2 bg-zinc-950" >
          <Skeleton className="w-[100%] h-[20px] rounded-full" />
        </Button>
        </div>
      </div>
      <div className="rounded-md border bg-zinc-950">
        <Table>
          <TableHeader className='py-1'>
            <TableRow>
              {Array.from({ length: columnCount }, (_, index) => (
                <TableHead
                  key={index}
                  style={{ width: columnWidths[index % columnWidths.length] }}
                >
                  <Skeleton className="w-[50%] h-[15px] rounded-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }, (_, columnIndex) => (
                  <TableCell key={columnIndex} className='py-5'>
                    <Skeleton className="w-[30%] h-[15px] rounded-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

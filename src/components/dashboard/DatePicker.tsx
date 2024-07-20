import * as React from "react";
import { format, addDays, subDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the props interface
interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const DatePicker: React.FC<DateSelectorProps> = ({
  selectedDate,
  onChange,
}) => {
  // Use the passed selectedDate as the initial state
  const [date, setDate] = React.useState<Date>(selectedDate);

  // Update the local state and call the onChange prop when the date changes
  const handleDateChange = React.useCallback(
    (newDate: Date | undefined) => {
      setDate(newDate || new Date());
      onChange(newDate || new Date());
    },
    [onChange]
  );

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span>{format(new Date(), "PPP")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;

import React, { useState, useEffect, ChangeEvent } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

const searchClient = algoliasearch("OYGQK96V5O", "46810e96a8854fc2b54d095bc05d3329");
const index = searchClient.initIndex('foods');

interface Hit {
  objectID: string;
  foodName: string;
  fat: number;
  carbs: number;
  proteins: number;
  calories: number;
}

interface SearchProps {
  onSelectFood: (food: Hit) => void;
}

const CommandHeader = () => (
  <div className="flex justify-between px-4 py-2 border-b text-xs bg-zinc-850">
    <span>Food Name</span>
    <div className="flex gap-2">
      <span>Fat</span>
      <span>Carbs</span>
      <span>Proteins</span>
    </div>
  </div>
);

const Search: React.FC<SearchProps> = ({ onSelectFood }) => {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [selectedFood, setSelectedFood] = useState<Hit | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      index.search<Hit>(query).then(({ hits }) => {
        setHits(hits);
      });
    } else {
      setHits([]);
    }
  }, [query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  const handleSelect = (food: Hit) => {
    setSelectedFood(food);
    onSelectFood(food);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedFood ? selectedFood.foodName : "Select food..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            value={query}
            onValueChange={handleInputChange}
            placeholder="Search Norwegian food..."
          />
          <CommandHeader />
          <CommandList>
            {hits.length === 0 && <CommandEmpty>No food found.</CommandEmpty>}
            {hits.map(hit => (
              <>
              <CommandItem
                key={hit.objectID}
                value={hit.foodName}
                onSelect={() => handleSelect(hit)}
              >
                <div className="flex justify-between w-full">
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedFood?.objectID === hit.objectID ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-medium">{hit.foodName}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1 h-5">{hit.fat}</Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-1 h-5">{hit.carbs}</Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-1 h-5">{hit.proteins}</Badge>
                  </div>
                </div>
              </CommandItem>
              <CommandSeparator/>
              </>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Search;

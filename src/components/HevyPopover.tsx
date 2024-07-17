import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { exerciseOptions } from "@/lib/exercises";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Set {
  reps: number;
  weight_kg: number;
  set_type: string;
}

interface Exercise {
  title: string;
  sets?: Set[];
  superset_id: number | null; // Allow null for superset_id
}

const findExerciseImage = (title: string) => {
  const exercise = exerciseOptions.find((option) => option.label === title);
  return exercise
    ? exercise.value
    : "https://cdn-icons-png.flaticon.com/512/4072/4072281.png";
};

export const HevyPopover = ({ exercises }: { exercises: Exercise[] }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center">
          {exercises.slice(0, 5).map((exercise, index) => (
            <Avatar
              key={index}
              className="h-8 w-8 bg-zinc-800 border p-1 border-zinc-600 -ml-2 first:ml-0"
            >
              <AvatarImage
                src={findExerciseImage(exercise.title)}
                alt={exercise.title}
              />
              <AvatarFallback>{exercise.title.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {exercises.length > 5 && (
            <Avatar className="h-8 w-8 border p-1 bg-zinc-800 border-zinc-600 -ml-2 text-xs">
              <AvatarFallback>+{exercises.length - 5}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <ScrollArea className="h-80">
          <div className="flex flex-col items-start gap-2 w-full">
            {exercises.map((exercise, exerciseIndex) => (
              <div
                key={exerciseIndex}
                className="flex flex-col gap-2 my-1 w-full hover:bg-zinc-900 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 bg-zinc-800 border p-0.5 border-zinc-600">
                    <AvatarImage
                      src={findExerciseImage(exercise.title)}
                      alt={exercise.title}
                    />
                    <AvatarFallback>{exercise.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="">
                    <span className="font-semibold text-sm">
                      {exercise.title}
                    </span>
                    {exercise.superset_id !== null && (
                      <div className="mt-0.5 text-xs">
                        <Badge variant="secondary">
                          Superset {exercise.superset_id}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {exercise.sets && (
                  <div className="text-xs text-gray-500 mt-1">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="py-0.5 flex items-center">
                        <Badge
                          variant="outline"
                          className="mr-1 px-5 w-6 h-6 flex items-center justify-center"
                        >
                          <span>
                            {set.set_type === "warmup"
                              ? "W"
                              : exercise.sets!
                                  .filter((s) => s.set_type === "normal")
                                  .indexOf(set) + 1}
                          </span>
                        </Badge>
                        <Badge variant="outline">
                          {set.weight_kg}kg x {set.reps} reps
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

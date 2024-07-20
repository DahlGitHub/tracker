import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { exerciseOptions } from "@/lib/exercises";

interface Exercise {
  label: string;
  value: string;
  sets?: { reps: number; weight_kg: number }[];
}

export const ExercisesPopover = ({ exercises }: { exercises: Exercise[] }) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="flex items-center">
        {exercises.slice(0, 5).map((exercise, index) => (
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
        {exercises.length > 5 && (
          <Avatar className="h-8 w-8 border p-1 bg-zinc-800 border-zinc-600 -ml-2 text-xs">
            <AvatarFallback>+{exercises.length - 5}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </PopoverTrigger>
    <PopoverContent>
      <div className="flex flex-col items-start gap-2">
        {exercises.map((exercise, index) => (
          <div key={index} className="flex items-start gap-2 my-1 w-full hover:bg-zinc-900 p-2 rounded-md">
            <Avatar className="h-12 w-12 bg-zinc-800 border p-0.5 border-zinc-600">
              {exercise.value.startsWith("http") ? (
                <AvatarImage src={exercise.value} alt={exercise.label} />
              ) : (
                <AvatarFallback>{exercise.label.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <span className="font-semibold">{exercise.label}</span>
              {exercise.sets && (
                <div className="text-xs text-gray-500 mt-1">
                  {exercise.sets.map((set, i) => (
                    <div key={i}>
                      Set {i + 1}: {set.reps} reps @ {set.weight_kg} kg
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

import React from "react";
import clsx from "clsx";

type IntensityDisplayProps = {
  intensity: string; // Assuming intensity is a string value like "Easy", "Medium", etc.
};

const IntensityDisplay: React.FC<IntensityDisplayProps> = ({ intensity }) => {
  // Function to determine color based on intensity
  const getColorClass = (intensity: string) => {
    switch (intensity) {
      case "easy":
        return "bg-yellow-300";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-green-500";
      case "intense":
        return "bg-red-500";
      case "maximum":
        return "bg-red-900";
      default:
        return "bg-gray-300"; // Default color
    }
  };

  // Function to determine text based on intensity
  const getText = (intensity: string) => {
    switch (intensity) {
      case "easy":
        return "20%";
      case "medium":
        return "40%";
      case "high":
        return "60%";
      case "intense":
        return "80%";
      case "maximum":
        return "100%";
      default:
        return "0%"; // Default text
    }
  };

  const colorClass = getColorClass(intensity);
  const text = getText(intensity);
  const capitalizedIntensity =
    intensity.charAt(0).toUpperCase() + intensity.slice(1);
  const percentage = parseInt(text, 10);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full">
        <div className="ml-1 text-xs">{capitalizedIntensity}</div>
        <div className="ml-auto mr-1 text-xs">{text}</div>
      </div>

      <div className="relative w-full h-1 bg-zinc-700 rounded-full mt-1">
        <div
          className={clsx(
            "absolute h-full rounded-full",
            colorClass,
            // Explicitly define width classes based on the percentage
            {
              "w-1/5": percentage === 20,
              "w-2/5": percentage === 40,
              "w-3/5": percentage === 60,
              "w-4/5": percentage === 80,
              "w-full": percentage === 100,
            }
          )}
        ></div>
      </div>
    </div>
  );
};

export default IntensityDisplay;

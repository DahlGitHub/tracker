import { Activity } from "lucide-react";
import { iconOptions, IconOption } from "@/lib/icons"; // Assuming IconOption and iconOptions are correctly defined
import { Badge } from "./ui/badge";

interface MealCellProps {
  mealName: string;
  iconName: string;
}

const getIconOptions = (icon: string): IconOption | undefined => {
  return iconOptions.find((option) => option.value === icon);
};

const MealCell: React.FC<MealCellProps> = ({ mealName, iconName }) => {
  const iconOptions = getIconOptions(iconName);

  return (
    <div className="flex items-start">
      {mealName === "None" ? (
        <Badge variant="secondary" className="px-1">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className="px-1">
            <span className="text-muted-foreground">None</span>
          </Badge>
        </Badge>
      ) : (
        <Badge variant="secondary" className="px-1">
          {iconOptions?.icon && <iconOptions.icon className="h-4 w-4" />}
          <Badge className="px-2" variant="secondary">
            <span>{mealName}</span>
          </Badge>
        </Badge>
      )}
    </div>
  );
};

export default MealCell;

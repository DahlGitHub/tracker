// icons.ts
import { LucideIcon, Apple, Banana, Bean, Beef, Carrot, Cherry, Citrus, Drumstick, Egg, EggFried, Fish, Grape, Ham, Milk, Nut, Pizza, Salad, Sandwich, Snail, Vegan, Wheat } from 'lucide-react';

export interface CategoryOption {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
}

export const categoryOptions: CategoryOption[] = [
    { value: 'Breakfast', label: 'Breakfast', icon: Apple, color: 'bg-yellow-100 text-yellow-700'},
    { value: 'Lunch', label: 'Lunch', icon: Banana, color: 'bg-green-100 text-green-700'},
    { value: 'Dinner', label: 'Dinner', icon: Bean, color: 'bg-red-100 text-red-700'},
    { value: 'Supper', label: 'Supper', icon: Beef, color: 'bg-blue-100 text-blue-700'},
];

export interface IconOption {
  value: string;
  icon: LucideIcon;
}

export const iconOptions: IconOption[] = [
    { value: 'apple', icon: Apple },
    { value: 'banana', icon: Banana },
    { value: 'bean', icon: Bean },
    { value: 'beef', icon: Beef },
    { value: 'carrot', icon: Carrot },
    { value: 'cherry', icon: Cherry },
    { value: 'citrus', icon: Citrus },
    { value: 'drumstick', icon: Drumstick },
    { value: 'egg', icon: Egg },
    { value: 'eggFried', icon: EggFried },
    { value: 'fish', icon: Fish },
    { value: 'grape', icon: Grape },
    { value: 'ham', icon: Ham },
    { value: 'milk', icon: Milk },
    { value: 'nut', icon: Nut },
    { value: 'pizza', icon: Pizza },
    { value: 'salad', icon: Salad },
    { value: 'sandwich', icon: Sandwich },
    { value: 'snail', icon: Snail },
    { value: 'vegan', icon: Vegan },
    { value: 'wheat', icon: Wheat },
  ];
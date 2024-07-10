// src/utils/calculateTotals.ts

type DietItem = {
    carbs: number;
    fat: number;
    gram: number;
    kcal: number;
    proteins: number;
  };
  
  type Diet = {
    id: string;
    meal: string;
    name: string;
    icon: string;
    items: DietItem[];
  };
  
  export const calculateTotals = (meals: Diet[]) => {
    return meals.reduce(
      (totals, meal) => {
        meal.items.forEach((item) => {
          totals.kcal += item.kcal;
          totals.carbs += item.carbs;
          totals.fat += item.fat;
          totals.proteins += item.proteins;
        });
        return totals;
      },
      { kcal: 0, carbs: 0, fat: 0, proteins: 0 }
    );
  };
  
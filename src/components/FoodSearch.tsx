import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Circle } from 'lucide-react';


const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ foodName: string; calories: number; proteins: number; fat: number; carbs: number; }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://www.matvaretabellen.no/api/nb/foods.json?search=${query}`
          );
          const data = await response.json();

          const formattedResults = data.foods.map((food: any) => {
            const nutrients = food.constituents.reduce((acc: any, item: any) => {
              switch (item.nutrientId) {
                case 'Energi (kcal)':
                  acc.calories = item.quantity;
                  break;
                case 'Protein':
                  acc.proteins = item.quantity;
                  break;
                case 'Fett':
                  acc.fat = item.quantity;
                  break;
                case 'Karbohydrater':
                  acc.carbs = item.quantity;
                  break;
                default:
                  break;
              }
              return acc;
            }, {});

            return {
              foodName: food.foodName,
              calories: nutrients.calories || 0,
              proteins: nutrients.proteins || 0,
              fat: nutrients.fat || 0,
              carbs: nutrients.carbs || 0,
            };
          });

          setResults(formattedResults);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        setLoading(false);
      } else {
        setResults([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="p-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for food..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {loading && <Circle className="mb-4" />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <Card key={index} className="p-4">
            <CardHeader>
              <CardTitle>{item.foodName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Calories: {item.calories} kcal</p>
              <p>Proteins: {item.proteins} g</p>
              <p>Fat: {item.fat} g</p>
              <p>Carbs: {item.carbs} g</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FoodSearch;

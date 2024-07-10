import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export interface Goals {
  kcal: number;
  proteins: number;
  fat: number;
  carbs: number;
}

const defaultGoals: Goals = {
  kcal: 0,
  proteins: 0,
  fat: 0,
  carbs: 0,
};

export const fetchGoals = async (userId: string): Promise<Goals> => {
  try {
    const userGoalsDoc = doc(db, "goals", userId);
    const userGoalsSnapshot = await getDoc(userGoalsDoc);

    if (userGoalsSnapshot.exists()) {
      return userGoalsSnapshot.data() as Goals;
    } else {
      return defaultGoals;
    }
  } catch (error) {
    console.error("Error fetching user goals:", error);
    return defaultGoals;
  }
};

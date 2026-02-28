"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

interface FoodItem {
  description: string;
  grade: number;
  id: number;
  image_key: string;
  url: string;
  location: string;
  name: string;
  type: string;
  user_id: number;
  created_at: string;
}

interface UIContextType {
  foodList: FoodItem[];
  setFoodList: Dispatch<SetStateAction<FoodItem[]>>;
}

const UIContext = createContext<UIContextType | null>(null);

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used within ProfileProviders");
  }

  return context;
}

export default function ProfileProviders({
  children,
  initialFoodList
}: {
  children: ReactNode;
  initialFoodList: FoodItem[];
}) {
  const [foodList, setFoodList] = useState<FoodItem[]>(initialFoodList);

  return (
    <UIContext.Provider value={{ foodList, setFoodList }}>
        {children}
    </UIContext.Provider>
  );
}

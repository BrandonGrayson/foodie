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

interface User {
  user_name: string
}

interface UIContextType {
  foodList: FoodItem[];
  setFoodList: Dispatch<SetStateAction<FoodItem[]>>;
  user: User
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
  initialFoodList,
  user
}: {
  children: ReactNode;
  initialFoodList: FoodItem[];
  user: User
}) {
  const [foodList, setFoodList] = useState<FoodItem[]>(initialFoodList);

  return (
    <UIContext.Provider value={{ foodList, setFoodList, user }}>
        {children}
    </UIContext.Provider>
  );
}

"use client";
import Grid from "@mui/material/Grid";
import FoodGrid from "./FoodGrid";
import { useState } from "react";
import ProfileFoodDialog from "./ProfileFoodDialog";
import { useUI } from "../providers/providers";

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

interface FavoritesListProps {
  foodList: FoodItem[];
}

export default function FavoritesList({ foodList }: FavoritesListProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {setFoodList} = useUI()

  const handleUserDelete = async (foodItem: FoodItem) => {
    try {
      const req = await fetch(`http://localhost:8000/foods/${foodItem.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!req.ok) return;

      const data = await req.json();

      setFoodList((prev) => prev.filter((food) => food.id !== data.id));

      setOpen(false);
    } catch (err) {
      // setError(err as Error);
      console.log('error', err)
    }
  };

  return (
    <Grid container>
      <FoodGrid
        foodList={foodList}
        setOpen={setOpen}
        setCurrentIndex={setCurrentIndex}
      />
      <ProfileFoodDialog
        foodList={foodList}
        open={open}
        setOpen={setOpen}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        onDelete={handleUserDelete}
      />
    </Grid>
  );
}

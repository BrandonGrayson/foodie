"use client";
import Grid from "@mui/material/Grid";
import FoodGrid from "./FoodGrid";
import { useState } from "react";
import ProfileFoodDialog from "./ProfileFoodDialog";
import { useUI } from "../providers/providers";
import { FoodItem } from "../schemas/schemas";

interface FavoritesListProps {
  foodList: FoodItem[];
}

export default function FavoritesList({ foodList }: FavoritesListProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {setFoodList} = useUI()

  const handleUserDelete = async (foodItem: FoodItem) => {
    try {
      const req = await fetch(`http://localhost:8000/favorite/${foodItem.id}`, {
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

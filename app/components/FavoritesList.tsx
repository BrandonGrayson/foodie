"use client";
import Grid from "@mui/material/Grid";
import FoodGrid from "./FoodGrid";
import { useState } from "react";

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
    foodList: FoodItem[]
}

export default function FavoritesList({foodList}: FavoritesListProps) {

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Grid container>
      <FoodGrid foodList={foodList} setOpen={setOpen} setCurrentIndex={setCurrentIndex} />
    </Grid>
  );
}

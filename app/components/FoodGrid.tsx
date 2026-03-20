"use client";
import {
  ImageList,
  ImageListItem,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  ButtonBase,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUI } from "../providers/providers";
import { useState } from "react";
import { FoodItem } from "../schemas/schemas";

interface FoodGridProps {
  foodList: FoodItem[];
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FoodGrid({ foodList, setCurrentIndex, setOpen }: FoodGridProps) {

  const handleImageSelection = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <Grid size={12}>
      <ImageList sx={{ width: "100%" }} cols={3}>
        {foodList.map((food, index) => (
          <ImageListItem
            key={food.image_key}
            onClick={() => handleImageSelection(index)}
            sx={{
              position: "relative",
              aspectRatio: "1 / 1",
              overflow: "hidden",
            }}
          >
            <ButtonBase
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              <Image
                alt="user favorites"
                fill
                sizes="(max-width: 600px) 33vw, 200px"
                style={{ objectFit: "cover" }}
                src={food.url}
              />
            </ButtonBase>
          </ImageListItem>
        ))}
      </ImageList>
    </Grid>
  );
}


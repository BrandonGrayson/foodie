"use client";
import { NewItems } from "../schemas/schemas";
import {
  ImageList,
  ImageListItem,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  ButtonBase,
  Dialog,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import FoodGrid from "./FoodGrid";
import { useState } from "react";

interface NewItemsListProps {
  newItems: NewItems[];
}
export default function NewItemsList({ newItems }: NewItemsListProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleImageSelection = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };
  return (
    <Grid size={12}>
      <ImageList sx={{ width: "100%" }} cols={3}>
        {newItems.map((item, index) => (
          <ImageListItem
            key={item.image_key}
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
                src={item.url}
              />
            </ButtonBase>
          </ImageListItem>
        ))}
      </ImageList>
    </Grid>
  );
}

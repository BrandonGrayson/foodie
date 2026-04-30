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
import ProfileFoodDialog from "./ProfileFoodDialog";
import BottomNav from "./BottomNav";
import { FoodItem } from "../schemas/schemas";

export default function UserFoodList() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { foodList, setFoodList } = useUI();

  // const foodItem = foodList[currentIndex];

  // console.log('foodList', foodList)

  const handleImageSelection = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

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

      console.log('err', err)
    }
  };

  return (
    <Grid
      container
      sx={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}
    >
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
                  unoptimized
                />
              </ButtonBase>
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
      {/* <Grid size={12}>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation sx={{ width: "100%" }}>
            <BottomNavigationAction
              value="add"
              icon={
                <label
                  htmlFor="upload-photo"
                  style={{ display: "flex", cursor: "pointer" }}
                >
                  <AddCircleOutlineIcon fontSize="large" />
                </label>
              }
            />
          </BottomNavigation>
        </Paper>
      </Grid> */}
      {foodList && (
        <ProfileFoodDialog
          open={open}
          setOpen={setOpen}
          foodList={foodList}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onDelete={handleUserDelete}
        />
      )}
    </Grid>
  );
}

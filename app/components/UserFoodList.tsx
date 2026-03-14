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

export default function UserFoodList() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { foodList } = useUI();

  const handleImageSelection = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
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
                />
              </ButtonBase>
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
      <Grid size={12}>
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
      </Grid>
      {foodList && (
        <ProfileFoodDialog
          open={open}
          setOpen={setOpen}
          foodList={foodList}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </Grid>
  );
}

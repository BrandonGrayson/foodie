"use client";
import {
  ImageList,
  ImageListItem,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  ButtonBase,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUI } from "../providers/providers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import ProfileFoodDialog from "./ProfileFoodDialog";

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

export default function UserFoodList() {
  const [open, setOpen] = useState(false);
  const [foodItem, setFoodItem] = useState<FoodItem | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { foodList } = useUI();
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleImageSelection = (index: number) => {
    console.log("Clicked Food Item", foodItem);
    setCurrentIndex(index);
    setOpen(true);
  };

  console.log("foodItems, FoodList", foodList);

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

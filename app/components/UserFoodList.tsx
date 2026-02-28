"use client";
import {
  ImageList,
  ImageListItem,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUI } from "../providers/providers";

export default function UserFoodList() {
  // const {foodList, setFoodList} = useUI();
  const { foodList } = useUI();

  console.log('foodItems, FoodList', foodList)
  
  return (
    <Grid
      container
      sx={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}
    >
      <Grid size={12}>
        <ImageList sx={{ width: "100%" }} cols={3}>
          {foodList.map((fav) => (
            <ImageListItem
              key={fav.image_key}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1", // 👈 square
                overflow: "hidden",
                borderRadius: 1,          
              }}
            >
              <Image
                alt="user favorites"
                fill
                sizes="(max-width: 600px) 33vw, 200px"
                style={{ objectFit: "cover" }}
                src={fav.url}
              />
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
    </Grid>
  );
}

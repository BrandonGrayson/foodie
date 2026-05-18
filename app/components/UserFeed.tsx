"use client";

import Grid from "@mui/material/Grid";
import {
  Card,
  Box,
  CardMedia,
  CardContent,
  Stack,
  Typography,
  Rating,
  CardActions,
  Button,
} from "@mui/material";
import BottomNav from "./BottomNav";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import ProfileFoodDialog from "./ProfileFoodDialog";
import { FoodItem } from "../schemas/schemas";

interface UserFeedProps {
  feed: FoodItem[];
}
export default function UserFeed({ feed }: UserFeedProps) {
  console.log("feed", feed);
  const [userFeed, setUserFeed] = useState<FoodItem[]>(feed);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const foodItem = userFeed[currentIndex];

  const handleUserLike = async (foodItem: FoodItem) => {
    if (!foodItem) return;

    try {
      const res = await fetch(
        `http://localhost:8000/foods/${foodItem.id}/like`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) return;

      const data = await res.json();

      setUserFeed((prev) =>
        prev.map((item) => {
          if (item.id !== foodItem.id) return item;

          const liked = data.status === "liked";

          return {
            ...item,
            liked_by_user: liked,
            like_count: liked ? item.like_count + 1 : item.like_count - 1,
          };
        }),
      );
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleComment = (index: number) => {
    setCurrentIndex(index)
    setOpen(true)
  }
  return (
    <Grid container>
      <Grid
        size={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Stack
          spacing={3}
          sx={{
            width: "100%",
            maxWidth: 600, // instagram-like feed width
            alignItems: "center",
          }}
        >
          {userFeed.map((food, index) => (
            <Card
              key={food.image_key}
              sx={{
                width: "100%",
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1", // instagram style
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  image={food.url}
                  alt={food.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <CardContent>
                <Stack spacing={1}>
                  <Typography fontWeight="bold">{food.name}</Typography>

                  <Typography>{food.description}</Typography>

                  <Typography color="text.secondary">
                    {food.location}
                  </Typography>

                  <Rating name="read-only" value={food.grade} readOnly />
                </Stack>
              </CardContent>
              <CardContent>
                <Stack direction="row" spacing={1}>
                  <FavoriteIcon color={food.liked_by_user ? "error" : "inherit"}  sx={{cursor: 'pointer'}} onClick={() => handleUserLike(food)} />
                  <Typography>{food.like_count}</Typography>
                  <ModeCommentIcon onClick={() => handleComment(index)} sx={{cursor: 'pointer'}} />
                  <Typography>{food.comment_count}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>
      <ProfileFoodDialog
       foodList={userFeed} 
       currentIndex={currentIndex} 
       setCurrentIndex={setCurrentIndex} 
       open={open}
       setOpen={setOpen}/>
    </Grid>
  );
}

"use client";

import Grid from "@mui/material/Grid";
import { FeedItem } from "../schemas/schemas";
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

interface UserFeedProps {
  feed: FeedItem[];
}
export default function UserFeed({ feed }: UserFeedProps) {
  console.log("feed", feed);
  const [userFeed, setUserFeed] = useState(feed);
  const [error, setError] = useState<Error | null>(null);

  const handleUserLike = async (foodItem: FeedItem) => {
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
          {userFeed.map((food) => (
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
                  <FavoriteIcon onClick={() => handleUserLike(food)} />
                  <Typography>{food.like_count}</Typography>
                  <ModeCommentIcon />
                  <Typography>{food.comment_count}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

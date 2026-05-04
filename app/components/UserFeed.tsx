"use client";

import Grid from "@mui/material/Grid";
import { FoodItem } from "../schemas/schemas";
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

interface UserFeedProps {
  feed: FoodItem[];
}
export default function UserFeed({ feed }: UserFeedProps) {
  return (
    <Grid container>
      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        {feed.map((food) => (
          <Card sx={{ maxWidth: 345, margin: 2 }} key={food.image_key}>
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16/9",
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
                  objectFit: "cover", // 🔥 crops instead of stretching
                }}
              />
            </Box>

            <CardContent>
              <Stack spacing={2}>
                <Typography>{food.name}</Typography>
                <Typography>{food.description}</Typography>
                <Typography>{food.location}</Typography>
                <Rating name="read-only" value={food.grade} readOnly />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

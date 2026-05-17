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
  console.log("feed", feed);
  return (
    <Grid container>
      <Grid>
        <Typography>This is the users feed</Typography>
      </Grid>
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
          {feed.map((food) => (
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
            </Card>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

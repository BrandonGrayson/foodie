"use client";

import {
  Stack,
  TextField,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogContent,
  DialogActions,
  CardHeader,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Add, Remove } from "@mui/icons-material";
import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { useUI } from "../providers/providers";
import { TopTen } from "../schemas/schemas";
import { FoodItem } from "../schemas/schemas";

interface TopTenProps {
  topTenList: TopTen[];
}

const handleAddImage = (food: FoodItem) => {
  console.log("hello");
  // setOpen(true);
  // setSelectedFood(food);
};

export default function TopTenList({ topTenList }: TopTenProps) {
  return (
    <Grid size={12}>
      <Grid
        spacing={2}
        direction="row"
        m={3}
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {topTenList.length > 0 ? (
          <>
            {topTenList.map((food) => (
              <Card sx={{ maxWidth: 345, margin: 2 }} key={food.image_key}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                      {food.rank}
                    </Avatar>
                  }
                  title={food.name}
                  subheader={new Date(food.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    },
                  )}
                />
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
                    <Typography>{food.type}</Typography>
                    <Typography>{food.description}</Typography>
                    <Typography>{food.location}</Typography>
                    <Rating name="read-only" value={food.grade} readOnly />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small">Re Rank</Button>
                </CardActions>
              </Card>
            ))}
          </>
        ) : (
          <Typography>No Top Ten Items</Typography>
        )}
      </Grid>
    </Grid>
  );
}

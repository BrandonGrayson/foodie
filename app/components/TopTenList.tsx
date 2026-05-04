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



export default function TopTenList({ topTenList }: TopTenProps) {

  const [topTen, setTopTen] = useState(topTenList)

  const handleDelete = async (food: TopTen) => {
  console.log("hello");
      try {
      const req = await fetch(`http://localhost:8000/remove/rank/topten/${food.food_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!req.ok) return;

      const data = await req.json();

      console.log('top ten delete data', data)

      // setTopTen((prev) => prev.filter((food) => food.food_id !== data.food_id));
      setTopTen(data)

    } catch (err) {
      // setError(err as Error);
      console.log('err', err)
    }
};
  return (
    <Grid size={12} >
      <Grid
        spacing={2}
        direction="row"
        m={3}
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {topTenList.length > 0 ? (
          <>
            {topTen.map((food) => (
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
                  <Button onClick={() => handleDelete(food)} size="small">Delete</Button>
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

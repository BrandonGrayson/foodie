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
  Button
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { useUI } from "../providers/providers";

export default function TopTenList() {

  const { foodList } = useUI();
  
  const [search, setSearch] = useState("");

  const filteredFoods = useMemo(() => {
    return foodList.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [foodList, search]);

  return (
    <Grid size={12}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <TextField
          value={search}
          sx={{ backgroundColor: "white" }}
          onChange={(e) => setSearch(e.target.value)}
          id="outlined-basic"
          label="Search Foods"
          variant="outlined"
        />
      </Box>

      <Grid
        spacing={2}
        direction="row"
        m={3}
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {filteredFoods.map((food) => (
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
                <Typography>{food.type}</Typography>
                <Typography>{food.description}</Typography>
                <Typography>{food.location}</Typography>
                <Rating name="read-only" value={food.grade} readOnly />
              </Stack>
            </CardContent>
            <CardActions>
              {/* <Button onClick={handleAddImage} size="small">Add</Button> */}
            </CardActions>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

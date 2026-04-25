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
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Add, Remove } from "@mui/icons-material";
import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { useUI } from "../providers/providers";
import { TopTen } from "../schemas/schemas";
import { FoodItem } from "../schemas/schemas";

interface SearchProps {
  topTenItems: TopTen[]
}

export default function Search({topTenItems}: SearchProps) {
  const { foodList } = useUI();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [rank, setRank] = useState(1);
  const [error, setError] = useState<Error | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>();

  const filteredFoods = useMemo(() => {
    return foodList.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [foodList, search]);

  const increment = () => {
    setRank((prev) => Math.min(prev + 1, 10));
  };

  const decrement = () => {
    setRank((prev) => Math.max(prev - 1, 1));
  };

  const handleAddImage = (food: FoodItem) => {
    setOpen(true);
    setSelectedFood(food);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTopTen = async () => {
    const new_rank = {
      "new_rank": rank
    };

    console.log('new_rank', new_rank)
    const food = selectedFood;

    if (!food) return;
    try {
      const req = await fetch(`http://localhost:8000/add/topten/${food.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_rank),
      });

      if (!req.ok) return;

      const data = await req.json();

      return data;
    } catch (err) {
      setError(err as Error);
    }
  };

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
              <Button onClick={() => handleAddImage(food)} size="small">
                Add
              </Button>
            </CardActions>
          </Card>
        ))}
        <Dialog fullWidth onClose={handleClose} open={open}>
          <DialogTitle>Edit Top Ten items</DialogTitle>

          <DialogContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={decrement} disabled={rank === 1}>
                <Remove />
              </IconButton>

              <Stack spacing={2} direction="row">
                <TextField
                  value={rank}
                  sx={{ width: 80 }}
                  slotProps={{
                    htmlInput: {
                      style: { textAlign: "center" },
                      readOnly: true,
                    },
                  }}
                />
                <IconButton onClick={increment} disabled={rank === 10}>
                  <Add />
                </IconButton>
              </Stack>

              {/* <Button variant="contained">Add</Button> */}
            </Box>
          </DialogContent>

          <DialogContent>
            {topTenItems.length > 0 ? (
              <FormGroup>
                {topTenItems.map((item) => (
                  <FormControlLabel
                    key={item.image_key}
                    disabled
                    control={<Checkbox />}
                    label={item.name}
                  />
                ))}
              </FormGroup>
            ) : (
              <Typography>No Top Ten Items</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleAddTopTen} autoFocus>
              Add Rank
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}

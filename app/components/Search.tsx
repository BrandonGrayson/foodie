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
  topTenItems: TopTen[];
}

export default function Search({ topTenItems }: SearchProps) {
  const { foodList, setHighlights } = useUI();

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
      new_rank: rank,
    };

    console.log("new_rank", new_rank);
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

      setOpen(false);
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleAddHighlight = async (food: FoodItem) => {
    try {
      const req = await fetch(`http://localhost:8000/profile/highlights/${food.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!req.ok) return;

      const data = await req.json();

      console.log('hightlight data', data)

      setHighlights(data)

      setOpen(false);
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <Grid size={12}>
      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: {
              xs: "80%", // mobile
              sm: "80%",
              md: "60%",
              lg: "40%",
            },
          }}
        >
          <TextField
            value={search}
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: "50px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px", 
              },
            }}
            onChange={(e) => setSearch(e.target.value)}
            id="outlined-basic"
            variant="outlined"
          />
        </Box>
      </Grid>

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
                <Typography>{food.description}</Typography>
                <Typography>{food.location}</Typography>
                <Rating name="read-only" value={food.grade} readOnly />
              </Stack>
            </CardContent>
            <CardActions>
              <Button onClick={() => handleAddImage(food)} size="small">
                Top Ten
              </Button>
              <Button onClick={() => handleAddHighlight(food)} size="small">
                Highlight
              </Button>
            </CardActions>
          </Card>
        ))}
        <Dialog fullWidth onClose={handleClose} open={open}>
          <DialogTitle>Edit Top Ten Items</DialogTitle>

          <DialogContent>
            <Typography>Rank Item</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={decrement} disabled={rank === 1}>
                <Remove />
              </IconButton>
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
              {/* <Button variant="contained">Add</Button> */}
            </Box>
          </DialogContent>

          <DialogContent>
            {topTenItems.length > 0 ? (
              <div>
                <Typography>Current Top Ten Items</Typography>
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
              </div>
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

"use client";
import { NewItems } from "../schemas/schemas";
import {
  ImageList,
  ImageListItem,
  Box,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Stack,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useState } from "react";

interface NewItemsListProps {
  newItems: NewItems[];
}
export default function NewItemsList({ newItems }: NewItemsListProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newItemsList, setNewItems] = useState(newItems)
    const tryItem = newItemsList[currentIndex];

  const handleImageSelection = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const req = await fetch(`http://localhost:8000/newItem/${tryItem.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!req.ok) return;

      const data = await req.json();
      setNewItems((prev) => prev.filter((food) => food.id !== data.id))

      setOpen(false);
    } catch (err) {
      // setError(err as Error);
      console.log('error', err)
    }
  };

  return (
    <Grid size={12}>
      <ImageList sx={{ width: "100%" }} cols={3}>
        {newItemsList.map((item, index) => (
          <ImageListItem
            key={item.image_key}
            onClick={() => handleImageSelection(index)}
            sx={{
              position: "relative",
              aspectRatio: "1 / 1",
              overflow: "hidden",
            }}
          >
            <ButtonBase
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              <Image
                alt="user favorites"
                fill
                sizes="(max-width: 600px) 33vw, 200px"
                style={{ objectFit: "cover" }}
                src={item.url}
              />
            </ButtonBase>
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle>You wanted to try...</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Image
              src={tryItem?.url ?? ""}
              alt="Item you wanted to try"
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>        

          <Stack sx={{ pt: 2 }} spacing={1}>
            {tryItem?.restaurant_name && (
              <Typography>{tryItem.restaurant_name}</Typography>
            )}
            {tryItem?.menu_item && <Typography>{tryItem?.menu_item}</Typography>}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDelete}>Remove</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

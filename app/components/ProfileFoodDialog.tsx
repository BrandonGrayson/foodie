"use client";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Box,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

interface FoodItem {
  description: string;
  grade: number;
  id: number;
  image_key: string;
  url: string;
  location: string;
  name: string;
  type: string;
  user_id: number;
  created_at: string;
}

interface ProfileDialogProps {
  foodItem: FoodItem;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileFoodDialog({
  foodItem,
  open,
  setOpen,
}: ProfileDialogProps) {
  //   const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  console.log("foodItem in profile dialog", foodItem);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
      <DialogTitle id="food-title">{foodItem.name}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 250, sm: 350, md: 450 }, // REQUIRED when using fill
          }}
        >
          <Image
            alt="user favorites"
            width={1200}
            height={800}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 800px"
            src={foodItem.url}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <DialogContentText>{foodItem.description}</DialogContentText>
        </Box>
        <Box>
          <IconButton aria-label="like">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="favorite">
            <BookmarkIcon />
          </IconButton>
        </Box>
      </DialogContent>
      {/* <DialogActions sx={{ p: 2 }}>
        <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="favorite">
          <BookmarkIcon />
        </IconButton>
      </DialogActions> */}
    </Dialog>
  );
}

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
import { useSwipeable } from "react-swipeable";

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
  foodList: FoodItem[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileFoodDialog({
  foodList,
  currentIndex,
  setCurrentIndex,
  open,
  setOpen,
}: ProfileDialogProps) {
  //   const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const foodItem = foodList[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % foodList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? foodList.length - 1 : prev - 1));
  };

  console.log("foodItem in profile dialog", foodItem);

  const handleClose = () => {
    setOpen(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        id="food-title"
        sx={{
          maxWidth: 800,
          mx: "auto",
          width: "100%",
        }}
      >
        {foodItem.name}
      </DialogTitle>
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
          {...handlers}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 800,
            margin: "0 auto",
            aspectRatio: "4 / 3",
          }}
        >
          <Image
            alt="user favorites"
            width={1200}
            height={800}
            priority={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 800px"
            src={foodItem.url}
          />

          {!isMobile && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.6)",
                },
              }}
            >
              ←
            </IconButton>
          )}

          {/* Left Arrow */}

          {/* Right Arrow */}
          {!isMobile && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.6)",
                },
              }}
            >
              →
            </IconButton>
          )}
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
    </Dialog>
  );
}

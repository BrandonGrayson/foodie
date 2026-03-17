"use client";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  Box,
  Alert,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ImageIcon from "@mui/icons-material/Image";

import Image from "next/image";
import { useSwipeable } from "react-swipeable";

import { useState, useEffect } from "react";

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

interface Comment {
  id: number;
  food_id: number;
  user_id: number;
  text: string;
  created_at: string;
}

interface Likes {
  food_id: number;
}

interface FoodInteractions {
  comments?: Comment[];
  liked?: boolean;
  bookmarked?: boolean;
}

export default function ProfileFoodDialog({
  foodList,
  currentIndex,
  setCurrentIndex,
  open,
  setOpen,
}: ProfileDialogProps) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [error, setError] = useState<Error | null>(null);

  const [foodCache, setFoodCache] = useState<Record<number, FoodInteractions>>(
    {}
  );

  /* ---------------------------
     SAFE DERIVED VALUES
  --------------------------- */

  const foodItem = foodList[currentIndex];

  const nextFood =
    foodList.length > 1
      ? foodList[(currentIndex + 1) % foodList.length]
      : undefined;

  const foodData = foodItem ? foodCache[foodItem.id] ?? {} : {};

  const comments = foodData.comments ?? [];
  const isLiked = foodData.liked ?? false;

  /* ---------------------------
     LOAD LIKES
  --------------------------- */

  useEffect(() => {
    if (!foodList.length) return;

    const loadLikes = async () => {
      try {

        const res = await fetch("http://localhost:8000/foods/likes", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch likes");

        const data = await res.json();

        const likedSet = new Set(data.map((item: Likes) => item.food_id));

        setFoodCache((prev) => {
          const updated = { ...prev };

          foodList.forEach((food) => {
            updated[food.id] = {
              ...updated[food.id],
              liked: likedSet.has(food.id),
            };
          });

          return updated;
        });

      } catch (err) {
        setError(err as Error);
      }
    };

    loadLikes();

  }, [foodList]);

  /* ---------------------------
     LOAD COMMENTS
  --------------------------- */

  useEffect(() => {

    if (!open) return;
    if (!foodItem) return;

    const loadComments = async () => {

      if (foodCache[foodItem.id]?.comments) return;

      try {

        const res = await fetch(
          `http://localhost:8000/foods/${foodItem.id}/comments`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = await res.json();

        setFoodCache((prev) => ({
          ...prev,
          [foodItem.id]: {
            ...prev[foodItem.id],
            comments: data,
          },
        }));

      } catch (err) {
        setError(err as Error);
      }
    };

    loadComments();

  }, [foodItem, open]);

  /* ---------------------------
     PREFETCH NEXT COMMENTS
  --------------------------- */

  useEffect(() => {

    if (!open) return;
    if (!nextFood) return;
    if (foodCache[nextFood.id]?.comments) return;

    const prefetchNext = async () => {

      try {

        const res = await fetch(
          `http://localhost:8000/foods/${nextFood.id}/comments`,
          { credentials: "include" }
        );

        if (!res.ok) return;

        const data = await res.json();

        setFoodCache((prev) => ({
          ...prev,
          [nextFood.id]: {
            ...prev[nextFood.id],
            comments: data,
          },
        }));

      } catch {}
    };

    prefetchNext();

  }, [nextFood, open]);

  /* ---------------------------
     NAVIGATION
  --------------------------- */

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % foodList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? foodList.length - 1 : prev - 1
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  /* ---------------------------
     LIKE
  --------------------------- */

  const handleUserLike = async () => {

    if (!foodItem) return;

    try {

      const res = await fetch(
        `http://localhost:8000/foods/${foodItem.id}/like`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) return;

      setFoodCache((prev) => ({
        ...prev,
        [foodItem.id]: {
          ...prev[foodItem.id],
          liked: !prev[foodItem.id]?.liked,
        },
      }));

    } catch (err) {
      setError(err as Error);
    }
  };

  /* ---------------------------
     RENDER GUARDS
  --------------------------- */

  if (!foodList.length || currentIndex >= foodList.length) return null;

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  /* ---------------------------
     UI
  --------------------------- */

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
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

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: { md: 600 },
        }}
      >
        {/* IMAGE */}
        <Box
          {...handlers}
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "60vh", md: "100%" },
            position: "relative",
          }}
        >
          {foodItem && (
            <Image
              src={foodItem.url}
              alt={foodItem.name}
              fill
              priority
              style={{ objectFit: "cover" }}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          )}
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2 }}>
            <DialogContentText>
              {foodItem?.description}
            </DialogContentText>
          </Box>

          {!isMobile && (
            <List
              sx={{
                width: "100%",
                maxHeight: 250,
                overflowY: "auto",
              }}
            >
              {comments.map((comment) => (
                <ListItem key={comment.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={comment.text} />
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{ p: 1 }}>
            <Stack direction="row" spacing={0.5}>
              <IconButton onClick={handleUserLike}>
                <FavoriteIcon
                  color={isLiked ? "error" : "inherit"}
                />
              </IconButton>

              <IconButton>
                <ModeCommentIcon />
              </IconButton>

              <IconButton>
                <BookmarkIcon />
              </IconButton>

              {!isMobile && (
                <>
                  <IconButton onClick={handlePrev}>←</IconButton>
                  <IconButton onClick={handleNext}>→</IconButton>
                </>
              )}
            </Stack>

            <TextField
              fullWidth
              placeholder="Add a comment"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
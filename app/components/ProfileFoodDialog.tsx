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
  Button,
  Rating,
  Divider,
} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { useUser } from "../providers/MainProvider";

import { useState, useEffect, useRef } from "react";
import { FoodItem } from "../schemas/schemas";

interface ProfileDialogProps {
  foodList: FoodItem[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: (food: FoodItem) => Promise<void>;
  onLikeToggle?: (foodId: number, liked: boolean) => void;
  onBookmarkToggle?: (foodId: number, bookmarked: boolean) => void;
}

interface Comment {
  id: number;
  food_id: number;
  user_id: number;
  text: string;
  created_at: string;

  user: {
    id: number;
    url: string;
    user_name: string;
  };
}

interface FoodInteractions {
  comments?: Comment[];
}

export default function ProfileFoodDialog({
  foodList,
  currentIndex,
  setCurrentIndex,
  open,
  setOpen,
  onDelete,
  onLikeToggle,
  onBookmarkToggle,
}: ProfileDialogProps) {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useUser();

  const [error, setError] = useState<Error | null>(null);

  const [foodCache, setFoodCache] = useState<
    Record<number, FoodInteractions>
  >({});

  const [focused, setFocused] = useState(false);

  const [commentText, setCommentText] = useState("");

  const hasLoadedComments = useRef(false);

  const foodItem = foodList[currentIndex];

  const nextFood =
    foodList.length > 1
      ? foodList[(currentIndex + 1) % foodList.length]
      : undefined;

  const foodData = foodItem ? (foodCache[foodItem.id] ?? {}) : {};

  const comments = foodData.comments ?? [];

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
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }

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
          {
            credentials: "include",
          },
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
      prev === 0 ? foodList.length - 1 : prev - 1,
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
     COMMENTS
  --------------------------- */

  const handleCommentAdded = async () => {
    if (!foodItem) return;

    if (!commentText.trim()) return;

    try {
      const req = await fetch(
        `http://localhost:8000/foods/comments/${foodItem.id}/${user.user_name}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentText,
          }),
        },
      );

      if (!req.ok) {
        throw new Error("Failed to create comment");
      }

      const data = await req.json();

      setCommentText("");

      setFoodCache((prev) => ({
        ...prev,
        [foodItem.id]: {
          ...prev[foodItem.id],
          comments: [data, ...(prev[foodItem.id]?.comments ?? [])],
        },
      }));
    } catch (err) {
      setError(err as Error);
    }
  };

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
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) return;

      const data = await res.json();

      const liked = data.status === "liked";

      onLikeToggle?.(foodItem.id, liked);
    } catch (err) {
      setError(err as Error);
    }
  };

  /* ---------------------------
     BOOKMARK
  --------------------------- */

  const handleBookmarkedItem = async () => {
    if (!foodItem) return;

    try {
      const req = await fetch(
        `http://localhost:8000/foods/${foodItem.id}/favorites/${user.user_name}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!req.ok) return;

      const data = await req.json();

      onBookmarkToggle?.(foodItem.id, data.favorited);
    } catch (err) {
      setError(err as Error);
    }
  };

  /* ---------------------------
     RENDER GUARDS
  --------------------------- */

  if (!foodList.length || currentIndex >= foodList.length) {
    return null;
  }

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
          zIndex: 9999,
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
          <Image
            src={foodItem.url}
            alt={foodItem.name}
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </Box>

        {/* RIGHT SIDE */}

        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* USER */}

          <Box>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  src={user.url ?? ""}
                  sx={{
                    width: { xs: 28, sm: 30, md: 42, lg: 48 },
                    height: { xs: 28, sm: 30, md: 42, lg: 48 },
                  }}
                />
              </ListItemAvatar>

              <ListItemText primary={user.user_name} />
            </ListItem>

            <Divider />
          </Box>

          {/* FOOD INFO */}

          <Stack
            sx={{ pt: 2, pl: 2 }}
            direction="column"
            spacing={1}
          >
            <DialogContentText>
              {foodItem.name}
            </DialogContentText>

            <DialogContentText>
              {foodItem.description}
            </DialogContentText>

            <DialogContentText>
              {foodItem.location}
            </DialogContentText>

            <Rating
              name="read-only"
              value={foodItem.grade}
              readOnly
            />
          </Stack>

          {/* COMMENTS */}

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
                    <Avatar
                      src={comment.user.url ?? ""}
                      sx={{
                        width: { xs: 28, sm: 30, md: 42, lg: 48 },
                        height: { xs: 28, sm: 30, md: 42, lg: 48 },
                      }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={comment.user.user_name}
                    secondary={comment.text}
                    slotProps={{
                      primary: {
                        sx: {
                          mb: 0.5,
                        },
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* ACTIONS */}

          <Box sx={{ p: 1 }}>
            <Stack direction="row" spacing={0.5}>
              <IconButton onClick={handleUserLike}>
                <FavoriteIcon
                  color={
                    foodItem.liked_by_user
                      ? "error"
                      : "inherit"
                  }
                />
              </IconButton>

              <DialogContentText>
                {foodItem.like_count}
              </DialogContentText>

              <IconButton onClick={() => setFocused(true)}>
                <ModeCommentIcon />
              </IconButton>

              <DialogContentText>
                {foodItem.comment_count}
              </DialogContentText>

              <IconButton onClick={handleBookmarkedItem}>
                <BookmarkIcon
                  color={
                    foodItem.bookmarked_by_user
                      ? "warning"
                      : "inherit"
                  }
                />
              </IconButton>

              {foodItem.user_id === user.id && onDelete && (
                <IconButton onClick={() => onDelete(foodItem)}>
                  <DeleteIcon />
                </IconButton>
              )}

              {!isMobile && (
                <>
                  <IconButton onClick={handlePrev}>
                    ←
                  </IconButton>

                  <IconButton onClick={handleNext}>
                    →
                  </IconButton>
                </>
              )}
            </Stack>

            {/* COMMENT INPUT */}

            <Stack direction="row">
              <TextField
                fullWidth
                placeholder="Add a comment"
                sx={{ mt: 1 }}
                focused={focused}
                value={commentText}
                onChange={(event) =>
                  setCommentText(event.target.value)
                }
              />

              <Button
                onClick={handleCommentAdded}
                disabled={commentText.length === 0}
              >
                Post
              </Button>
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
"use client";
import {
  Stack,
  Typography,
  ImageList,
  ImageListItem,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  DialogContentText,
  Button,
} from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import AppsIcon from "@mui/icons-material/Apps";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Link from "next/link";
import { useUI } from "../providers/providers";

interface User {
  created_at: string;
  email: string;
  id: number;
  user_name: string;
  full_name: string;
}

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

interface Following {
  following_id: number;
  follower_id: number;
}

interface Followers {
  following_id: number;
  follower_id: number;
}

interface ProfileHeaderProps {
  user: User;
  following: Following[];
  followers: Followers[];
}

export default function ProfileHeader({
  user,
  following,
  followers,
}: ProfileHeaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openMetaDialog, setOpenMetaDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState(0);
  const [type, setType] = useState("");
  const { foodList, setFoodList } = useUI();

  const handleClose = () => {
    setOpenMetaDialog(false);
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // 👈 must match parameter name in FastAPI

    const res = await fetch("http://localhost:8000/uploadfood", {
      method: "POST",
      credentials: "include", // 👈 important if using auth cookies
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return res.json();
  };

  const uploadImageMetaData = async (key: string) => {
    const foodieMetaData = {
      name,
      description,
      location,
      type,
      grade,
      image_key: key,
    };

    const res = await fetch("http://localhost:8000/foods", {
      method: "POST",
      credentials: "include", // 👈 important if using auth cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodieMetaData),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;
    const uploaded = await uploadImage(selectedFile); // ✅ immediate upload
    const uploadFood = await uploadImageMetaData(uploaded.key);

    console.log("uploadFood", uploadFood);

    setFoodList((prev) => [uploadFood, ...prev]);

    setOpenMetaDialog(false);
  };

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setSelectedFile(selected);
    setPreview(URL.createObjectURL(selected));

    setOpenMetaDialog(true);
  }

  return (
    <>
      <Grid
        size={{ xs: 6 }}
        // sx={{ marginTop: "25px", border: "3px solid red", maxWidth: "100%" }}
        sx={{ width: "100%", overflow: "hidden", boxSizing: "border-box", marginTop: "25px", border: "3px solid red", maxWidth: "100%" }}
        id="homepage"
      >
        <Avatar id="profile_img" src="/broken-image.jpg" />
      </Grid>
      <Grid
        size={{ xs: 6 }}
        sx={{ marginTop: "25px", border: "3px solid red", maxWidth: "100%" }}
        id="homepage"
      >
        <Typography>{user.user_name}</Typography>
        <Typography>{user.full_name}</Typography>
        <Stack direction="row" spacing={1}>
          <Stack>
            <Typography>{foodList.length}</Typography>
            <Typography>Posts</Typography>
          </Stack>
          <Stack>
            <Typography>{followers.length}</Typography>
            <Typography>Followers</Typography>
          </Stack>
          <Stack>
            <Typography>{following.length}</Typography>
            <Typography>Following</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={12}>
        <input
          type="file"
          accept="image/*"
          hidden
          id="upload-photo"
          onChange={handleChange}
        />

        {preview && (
          <Avatar src={preview} sx={{ width: 100, height: 100, mt: 2 }} />
        )}
      </Grid>
      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Stack direction="row" spacing={10}>
          <Link href="/profile">
            <AppsIcon
              sx={{ height: "4em", display: "flex", cursor: "pointer" }}
            />
          </Link>
          <Link href="/favorites">
            <FavoriteIcon sx={{ height: "4em", cursor: "pointer" }} />
          </Link>
          <Link href="/recipes">
            <BookmarkIcon sx={{ height: "4em", cursor: "pointer" }} />
          </Link>
          <Link href="tagged">
            <BookmarkAddIcon sx={{ height: "4em", cursor: "pointer" }} />
          </Link>
        </Stack>
      </Grid>
      <Dialog open={openMetaDialog} onClose={handleClose}>
        <DialogTitle>Foodie Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter some basic information to remember about this experience
          </DialogContentText>
        </DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-controlled"
            label="Name"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Type"
            value={type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setType(event.target.value);
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Description"
            value={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDescription(event.target.value);
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Overall Grade"
            value={grade}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setGrade(parseInt(event.target.value));
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Location"
            value={location}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLocation(event.target.value);
            }}
          />
          <DialogActions>
            <Button type="submit">Submit</Button>
            <Button>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

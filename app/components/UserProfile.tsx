"use client";
import {
  Stack,
  Typography,
  ImageList,
  ImageListItem,
  Button,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useState } from "react";

interface Favorites {
  id: number;
  src: {
    original: string;
  };
}

export default function UserProfile({ favorites }: { favorites: Favorites[] }) {
  // default profile picture

  // highlights / top 10 foods

  // need to be able to upload pictures from here

  // need a list of images of places visited

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  //   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //     const selected = e.target.files?.[0];
  //     if (!selected) return;

  //     setFile(selected);
  //     setPreview(URL.createObjectURL(selected));
  //   }

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));

    uploadImage(selected); // ✅ immediate upload
  }

  //
  return (
    <Grid
      container
      sx={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}
    >
      <Grid
        size={{ xs: 6 }}
        sx={{ marginTop: "25px", border: "3px solid red", maxWidth: "100%" }}
        id="homepage"
      >
        <Avatar id="profile_img" src="/broken-image.jpg" />
      </Grid>
      <Grid
        size={{ xs: 6 }}
        sx={{ marginTop: "25px", border: "3px solid red", maxWidth: "100%" }}
        id="homepage"
      >
        <Typography>UserName</Typography>
        <Typography>Steve Ross</Typography>
        <Stack direction="row" spacing={1}>
          <Stack>
            <Typography>14</Typography>
            <Typography>Posts</Typography>
          </Stack>
          <Stack>
            <Typography>14</Typography>
            <Typography>Followers</Typography>
          </Stack>
          <Stack>
            <Typography>14</Typography>
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

        <label htmlFor="upload-photo">
          <Button variant="contained" component="span">
            Upload Photo
          </Button>
        </label>
        {/* <input
          type="file"
          accept="image/*"
          hidden
          id="upload-photo"
          onChange={handleChange}
        />

        <label htmlFor="upload-photo">
          <Button onClick={() => {
            if (!file) return;  
            uploadImage(file)
          }} variant="contained" component="span">
            Upload Photo
          </Button>
        </label> */}

        {preview && (
          <Avatar src={preview} sx={{ width: 100, height: 100, mt: 2 }} />
        )}
      </Grid>
      <Grid size={12}>
        <ImageList sx={{ width: "100%" }} cols={3}>
          {favorites.map((fav) => (
            <ImageListItem
              key={fav.id}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1", // 👈 square
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              <Image
                alt="user favorites"
                fill
                sizes="(max-width: 600px) 33vw, 200px"
                style={{ objectFit: "cover" }}
                src={fav.src.original}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
}

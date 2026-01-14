"use client";
import { Stack, Typography, ImageList, ImageListItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Image from "next/image";

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

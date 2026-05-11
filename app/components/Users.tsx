"use client";
import Grid from "@mui/material/Grid";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { User } from "../schemas/schemas";
import { useRouter } from "next/navigation";

export default function Users() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    console.log("search users");
    try {
      const req = await fetch("http://localhost:8000/users/search", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name: search }),
      });

      if (!req.ok) {
        return {};
      }

      const data = await req.json();

      setUser(data);

      return data;
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleUserSelection = () => {
    console.log("");
    if (!user) return;

    router.push(`/profile/${user.user_name}`);
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
            marginTop: 10,
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handleSearch}
                    />
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) => setSearch(e.target.value)}
            id="outlined-basic"
            variant="outlined"
          />
          {!user ? (
            <Typography sx={{ marginTop: 5 }}>No Users to display</Typography>
          ) : null}
          {user ? (
            <ListItem
              sx={{ marginTop: 1, cursor: "pointer" }}
              onClick={handleUserSelection}
            >
              <ListItemAvatar>
                <Avatar
                  id="profile_img"
                  src={user.url ?? ""}
                  sx={{
                    width: { xs: 28, sm: 30, md: 42, lg: 48 },
                    height: { xs: 28, sm: 30, md: 42, lg: 48 },
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                sx={{ display: "flex", flexWrap: "wrap" }}
                primary={user.user_name}
              />
            </ListItem>
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
}

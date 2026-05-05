"use client";
import Grid from "@mui/material/Grid";
import { Box, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Users() {
  const [search, setSearch] = useState("");
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
            marginTop: 10
          }}
        >
          <TextField
            value={search}
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: "50px", // outer wrapper (optional)
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px", // 🔥 this is what actually rounds it
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) => setSearch(e.target.value)}
            id="outlined-basic"
            variant="outlined"
          />
        </Box>
      </Grid>
    </Grid>
  );
}

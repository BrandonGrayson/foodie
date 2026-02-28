"use client";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("login");

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        body: formData,
        credentials: "include", // 🔥 REQUIRED
      });
      if (!res.ok) {
        alert("Login failed");
        return;
      }

      // console.log('login response', )

      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid spacing={2}>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Stack spacing={2}>
          <Typography
            sx={{
              fontSize: "3em",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              fontFamily: "poppins",
            }}
          >
            Foodie
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            sx={{ backgroundColor: "grey", marginTop: "10px" }}
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            sx={{ backgroundColor: "grey" }}
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />

          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>

          <Stack direction="row" spacing={2}>
            <Typography>Dont have an Account?</Typography>

            <Link href="/create-account">Sign Up</Link>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

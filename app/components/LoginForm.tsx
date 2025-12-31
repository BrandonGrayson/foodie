"use client";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography, Stack, Button } from "@mui/material";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("login");

        const formData = new FormData()
        formData.append("username", email)
        formData.append("password", password)

        try {
            const req = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiZXhwIjoxNzY3MjE4MzcwfQ.sGZC4tKCVGO2mbim-CevO0oLKuMHOmDfayiTOf0ywW0"
                },
                body: formData
            })

            const res = await req.json()

            console.log('login response', res)

            return res
        } catch (error) {
            console.log(error)
        }
  };

    const createAccount = () => {
        console.log('create account')
    }

    return (
        <Grid spacing={2}>
            <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                    <Typography>Foodie</Typography>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ backgroundColor: "grey", marginTop: "10px" }}
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        sx={{ backgroundColor: "grey" }}
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }}
                    />

                    <Button onClick={handleLogin}>Log In</Button>

                    <Stack direction="row" spacing={2}>
                        <Typography>Dont have an Account?</Typography>

                        <Button onClick={createAccount}>Sign Up</Button>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
}

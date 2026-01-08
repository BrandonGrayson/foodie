"use client";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography, Stack, Button } from "@mui/material";
import Link from "next/link";

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
                body: formData
            })

            const accessToken = await req.json()

            console.log('login response', accessToken)

            return accessToken
        } catch (error) {
            console.log(error)
        }
    };



    return (
        <Grid spacing={2}>
            <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <Stack spacing={2}>
                    <Typography sx={{fontSize: '3em', width: '100%', display: 'flex', justifyContent: 'center', fontFamily: 'poppins'}}>Foodie</Typography>
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

                    <Button variant="contained" onClick={handleLogin}>Log In</Button>

                    <Stack direction="row" spacing={2}>
                    
                        <Typography>Dont have an Account?</Typography>

                        <Link href="/create-account">Sign Up</Link>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
}

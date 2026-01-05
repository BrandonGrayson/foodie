"use client";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Link from "next/link";

export default function CreateAccountForm() {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [fullName, setFullName] = useState("")
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const createAccount = async () => {
        console.log('create account')

        try {
            const req = await fetch("http://127.0.0.1:8000/users", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiZXhwIjoxNzY3MjE4MzcwfQ.sGZC4tKCVGO2mbim-CevO0oLKuMHOmDfayiTOf0ywW0"
                },
                body: "hello"
            })

            const res = await req.json()

            console.log('login response', res)

            return res
        } catch (error) {
            console.log(error)
        }
    }
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
                <Stack spacing={1}>
                    <Typography
                        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
                    >
                        Foodie
                    </Typography>
                    <Typography>
                        Sign up to see photos and videos from your friends
                    </Typography>
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNumber}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="Full Name"
                        variant="outlined"
                        value={fullName}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="UserName"
                        variant="outlined"
                        value={userName}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="Password"
                        variant="outlined"
                        value={password}
                    />
                    <Button onClick={createAccount} variant="contained"> Sign Up</Button>

                    <Typography>Have an Account?</Typography>
                    <Link href="/">Log in</Link>
                </Stack>
                <Grid
                    size={{ xs: 12 }}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                ></Grid>
            </Grid>
        </Grid>
    );
}

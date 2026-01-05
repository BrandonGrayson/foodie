"use client";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { json } from "stream/consumers";

export default function CreateAccountForm() {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")

    const createAccount = async () => {
        console.log('create account')

        const userCredentials = {email: email, password: password, phone_number: phoneNumber, full_name: fullName, user_name: userName}

        try {
            const req = await fetch("http://127.0.0.1:8000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCredentials)
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
                        onChange={(event) => {
                            setPhoneNumber(event.target.value)
                        }}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="Full Name"
                        variant="outlined"
                        value={fullName}
                        onChange={(event) => {
                            setFullName(event.target.value)
                        }}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)
                        }}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                    />
                    <TextField
                        sx={{ backgroundColor: "grey" }}
                        label="UserName"
                        variant="outlined"
                        value={userName}
                        onChange={(event) => {
                            setUserName(event.target.value)
                        }}
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

"use client";

import { useRef, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import BottomNav from "./BottomNav";
import { FoodItem, User, Following, Followers } from "../schemas/schemas";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Stack,
  DialogActions,
  Button
} from "@mui/material";
import { useUI } from "../providers/providers";

interface UploadProviderProps {
  user: User;
  following: Following[];
  followers: Followers[];
  highlights: FoodItem[];
  children: React.ReactNode;
}

export default function UploadProvider({
  children,
  user,
  following,
  followers,
  highlights,
}: UploadProviderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openMetaDialog, setOpenMetaDialog] = useState(false);
  const [openTryLaterMetaDialog, setOpenTryLaterMetaDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [menuItem, setMenuItem] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const { setTryLater } = useUI()

  const uploadImageMetaData = async (key: string) => {
    const NewItemMetaDay = {
      restaurant_name: restaurantName,
      menu_item: menuItem,
      image_key: key,
    };

    try {
      const res = await fetch("http://localhost:8000/newItem/totry", {
        method: "POST",
        credentials: "include", // 👈 important if using auth cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(NewItemMetaDay),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      return res.json();
    } catch (errorResponse) {
      setError(errorResponse as Error);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // 👈 must match parameter name in FastAPI

    try {
      const res = await fetch("http://localhost:8000/newItem/totry/upload", {
        method: "POST",
        credentials: "include", // 👈 important if using auth cookies
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      return res.json();
    } catch (errorResponse) {
      setError(errorResponse as Error);
    }
  };

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (uploadType == "Post") {
      const selected = e.target.files?.[0];
      if (!selected) return;

      setSelectedFile(selected);
      // setPreview(URL.createObjectURL(selected));

      setOpenMetaDialog(true);
    } else if (uploadType === "Try Later") {
      const selected = e.target.files?.[0];
      if (!selected) return;

      setSelectedFile(selected);

      setOpenTryLaterMetaDialog(true);
    }
  }

  const handleClose = () => {
    setOpenTryLaterMetaDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;

    const uploaded = await uploadImage(selectedFile);
    const uploadFood = await uploadImageMetaData(uploaded.key);

    console.log("uploadFood", uploadFood);

    setTryLater((prev) => [uploadFood, ...prev]);

    setOpenTryLaterMetaDialog(false);
  };

  return (
    <>
      <ProfileHeader
        user={user}
        followers={followers}
        following={following}
        highlights={highlights}
        setOpenMetaDialog={setOpenMetaDialog}
        selectedFile={selectedFile}
        openMetaDialog={openMetaDialog}
      />
      {children} 
      <BottomNav
        fileInputRef={fileInputRef}
        setUploadType={setUploadType}
        // setOpenMetaDialog={setOpenMetaDialog}
      />
      <input type="file" hidden ref={fileInputRef} onChange={handleChange} />
      <Dialog open={openTryLaterMetaDialog} onClose={handleClose}>
        <DialogTitle>Try Later</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What is it that you want to try later
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              id="outlined-controlled"
              label="Restaurant Name"
              value={restaurantName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRestaurantName(event.target.value);
              }}
            />

            <TextField
              id="outlined-controlled"
              label="Menu Item"
              value={menuItem}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setMenuItem(event.target.value);
              }}
            />
            <Stack sx={{ m: 2 }} spacing={2}>
              <DialogActions>
                <Button type="submit">Submit</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

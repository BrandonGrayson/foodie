"use client";
import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  DialogContentText,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import AppsIcon from "@mui/icons-material/Apps";
import IconButton from "@mui/material/IconButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Link from "next/link";
import { useUI } from "../providers/providers";
import { FoodItem } from "../schemas/schemas";
import ChecklistIcon from '@mui/icons-material/Checklist';
import Timer10SelectIcon from '@mui/icons-material/Timer10Select';

interface User {
  created_at: string;
  email: string;
  id: number;
  user_name: string;
  full_name: string;
  url: string;
  bio: string | null;
  phone_number: string;
  profile_image_key?: string;
}

interface Following {
  following_id: number;
  follower_id: number;
}

interface Followers {
  following_id: number;
  follower_id: number;
}

interface ProfileHeaderProps {
  user: User;
  following: Following[];
  followers: Followers[];
  highlights: FoodItem[];
  selectedFile: File | null;
  openMetaDialog: boolean;
  setOpenMetaDialog: React.Dispatch<React.SetStateAction<boolean>>;
  // fileInputRef: HTMLInputElement | null;
}

export default function ProfileHeader({
  user,
  following,
  followers,
  highlights,
  selectedFile,
  openMetaDialog,
  setOpenMetaDialog
  // fileInputRef
}: ProfileHeaderProps) {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [openMetaDialog, setOpenMetaDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState(0);
  const [type, setType] = useState("");
  const { foodList, setFoodList } = useUI();
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const PAGE_SIZE = 6;
  const [userProfile, setUserProfile] = useState<User>(user);
  const [originalUser, setOriginalUser] = useState(user);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUserProfile(user);
    setOriginalUser(user);
  }, [user]);

  const totalPages = Math.ceil(highlights.length / PAGE_SIZE);

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages); // loop
  };

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages); // loop backwards
  };

  const visibleFoods = highlights.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const handleClose = () => {
    setOpenMetaDialog(false);
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // 👈 must match parameter name in FastAPI

    try {
      const res = await fetch("http://localhost:8000/food/upload", {
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

  const uploadImageMetaData = async (key: string) => {
    const foodieMetaData = {
      name,
      description,
      location,
      type,
      grade,
      image_key: key,
    };

    try {
      const res = await fetch("http://localhost:8000/foods", {
        method: "POST",
        credentials: "include", // 👈 important if using auth cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foodieMetaData),
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

  const updateUserProfile = async () => {
    const formData = new FormData();

    // Only append changed fields
    if (userProfile.bio !== originalUser.bio) {
      formData.append("bio", userProfile.bio ?? "");
    }

    if (userProfile.phone_number !== originalUser.phone_number) {
      formData.append("phone_number", userProfile.phone_number ?? "");
    }

    if (profileFile) {
      formData.append("file", profileFile);
    }

    // Nothing changed → exit early
    if ([...formData.entries()].length === 0) return;

    const res = await fetch("http://localhost:8000/users/profile", {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;
    const uploaded = await uploadImage(selectedFile); // ✅ immediate upload
    const uploadFood = await uploadImageMetaData(uploaded.key);

    console.log("uploadFood", uploadFood);

    setFoodList((prev) => [uploadFood, ...prev]);

    setOpenMetaDialog(false);
  };

  // async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const selected = e.target.files?.[0];
  //   if (!selected) return;

  //   setSelectedFile(selected);
  //   // setPreview(URL.createObjectURL(selected));

  //   setOpenMetaDialog(true);
  // }

  console.log("user", user);

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  const handleUserProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUserProfile();

      if (!updatedUser) return;

      setUserProfile(updatedUser);
      setOriginalUser(updatedUser);

      setProfileFile(null);
      setOpenProfile(false);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileFile(file);

    setOpenProfile(true);
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  console.log('user', user)

  return (
    <>
      <Grid
        size={{ xs: 6 }}
        // sx={{ marginTop: "25px", border: "3px solid red", maxWidth: "100%" }}
        sx={{
          width: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          marginTop: "25px",
          maxWidth: "100%",
        }}
        id="homepage"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: { xs: 2, md: 4 }, // responsive spacing
          }}
        >
          <Stack
            direction="row"
            spacing={3}
            alignItems="center" // 👈 vertically align avatar + text
          >
            <Avatar
              id="profile_img" 
              src={userProfile.url}
              sx={{
                width: { xs: 48, sm: 56, md: 64, lg: 80 },
                height: { xs: 48, sm: 56, md: 64, lg: 80 }, // fix typo (47 → 48)
              }}
            />

            <Box>
              <Typography>{user.user_name}</Typography>
              <Typography>{user.full_name}</Typography>

              <Stack direction="row" spacing={2}>
                <Stack alignItems="center">
                  <Typography>{foodList.length}</Typography>
                  <Typography>Posts</Typography>
                </Stack>

                <Stack alignItems="center">
                  <Typography>{followers.length}</Typography>
                  <Typography>Followers</Typography>
                </Stack>

                <Stack alignItems="center">
                  <Typography>{following.length}</Typography>
                  <Typography>Following</Typography>
                </Stack>
              </Stack>
            </Box>
            
          </Stack>

          <Button onClick={() => setOpenProfile(true)}>Edit Profile</Button>
          <Box display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
            <IconButton sx={{ color: "white" }} onClick={handlePrev}>
              ←
            </IconButton>

            <Box display="flex" gap={1}>
              {visibleFoods.map((food) => (
                <Avatar
                  key={food.id}
                  src={food.url}
                  sx={{
                    width: { xs: 40, sm: 48, md: 56 },
                    height: { xs: 40, sm: 48, md: 56 },
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>

            <IconButton sx={{ color: "white" }} onClick={handleNext}>
              →
            </IconButton>
          </Box>
        </Box>
      </Grid>
      {/* <Grid size={12}>
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
          ref={fileInputRef}
        />
      </Grid> */}
      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Stack direction="row" spacing={10}>
          <Link href="/profile">
            <AppsIcon
              sx={{ height: "4em", display: "flex", cursor: "pointer" }}
            />
          </Link>
          <Link href="/profile/favorites">
            <BookmarkIcon sx={{ height: "4em", cursor: "pointer" }} />
          </Link>
          <Link href="/profile/newItem">
            <ChecklistIcon sx={{ height: "4em", cursor: "pointer" }} />
          </Link>
          <Link href="/profile/topTen">
            <Timer10SelectIcon sx={{ height: "4em", cursor: "pointer" }} />
          </Link>
        </Stack>
      </Grid>
      <Dialog open={openMetaDialog} onClose={handleClose}>
        <DialogTitle>Foodie Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter some basic information to remember about this experience
          </DialogContentText>
        </DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack sx={{ m: 2 }} spacing={2}>
            <TextField
              id="outlined-controlled"
              label="Name"
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Type"
              value={type}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setType(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Description"
              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Overall Grade"
              type="number"
              value={grade}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setGrade(parseInt(event.target.value));
              }}
              slotProps={{
                htmlInput: { min: 0, max: 5 },
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Location"
              value={location}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLocation(event.target.value);
              }}
            />
          </Stack>
          <DialogActions>
            <Button type="submit">Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openProfile} onClose={handleProfileClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={(event) => handleUserProfileSubmit(event)}>
            <Stack direction="row" sx={{ m: 2 }} spacing={2}>
              <Avatar
                id="profile_img"
                src={userProfile.url ?? ''}
                sx={{
                  width: { xs: 48, sm: 56, md: 64, lg: 80 },
                  height: { xs: 48, sm: 56, md: 64, lg: 80 },
                }}
              />
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Stack>
            <Stack spacing={2}>
            <TextField
              multiline
              value={userProfile.bio ?? ''}
              onChange={(event) =>
                setUserProfile((prev) => ({
                  ...prev,
                  bio: event.target.value,
                }))
              }
              sx={{ m: 2 }}
              placeholder="Update Bio"
            />
            <TextField
              onChange={(event) =>
                setUserProfile((prev) => ({
                  ...prev,
                  phone_number: event.target.value,
                }))
              }
              value={userProfile.phone_number}
              sx={{ m: 2 }}
              placeholder="Phone Number"
            />
            </Stack>

            <DialogActions>
              <Button type="submit">Submit</Button>
              <Button onClick={handleProfileClose}>Cancel</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

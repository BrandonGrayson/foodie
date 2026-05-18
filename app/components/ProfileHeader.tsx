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
import { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import AppsIcon from "@mui/icons-material/Apps";
import IconButton from "@mui/material/IconButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Link from "next/link";
import { useUI } from "../providers/providers";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Timer10SelectIcon from "@mui/icons-material/Timer10Select";
import SearchIcon from "@mui/icons-material/Search";
import ProfileFoodDialog from "./ProfileFoodDialog";
import { useUser } from "../providers/MainProvider";
import { FoodItem } from "../schemas/schemas";

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
  profileUser: User;
  following: Following[];
  followers: Followers[];
  selectedFile: File | null;
  openMetaDialog: boolean;
  setOpenMetaDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileHeader({
  profileUser,
  following,
  followers,
  selectedFile,
  openMetaDialog,
  setOpenMetaDialog,
}: ProfileHeaderProps) {
  const { user, setUser } = useUser();

  const {
    foodList,
    setFoodList,
    highlights,
    setHighlights,
  } = useUI();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState(0);
  const [type, setType] = useState("");

  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState(0);

  const [openProfile, setOpenProfile] = useState(false);

  const [profileFile, setProfileFile] = useState<File | null>(null);

  const PAGE_SIZE = 6;

  const [editableProfile, setEditableProfile] =
    useState<User>(profileUser);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [open, setOpen] = useState(false);

  const isOwnProfile = user.id === profileUser.id;

  useEffect(() => {
    setEditableProfile(profileUser);
  }, [profileUser]);

  const totalPages = Math.max(
    1,
    Math.ceil(highlights.length / PAGE_SIZE),
  );

  const visibleFoods = useMemo(() => {
    return highlights.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE + PAGE_SIZE,
    );
  }, [highlights, page]);

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleClose = () => {
    setOpenMetaDialog(false);
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await fetch(
        "http://localhost:8000/food/upload",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error(await res.text());
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
      const res = await fetch(
        "http://localhost:8000/foods",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foodieMetaData),
        },
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    } catch (errorResponse) {
      setError(errorResponse as Error);
    }
  };

  const updateUserProfile = async () => {
    const formData = new FormData();

    if (editableProfile.bio !== user.bio) {
      formData.append("bio", editableProfile.bio ?? "");
    }

    if (
      editableProfile.phone_number !== user.phone_number
    ) {
      formData.append(
        "phone_number",
        editableProfile.phone_number ?? "",
      );
    }

    if (profileFile) {
      formData.append("file", profileFile);
    }

    if ([...formData.entries()].length === 0) return;

    const res = await fetch(
      "http://localhost:8000/users/profile",
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!selectedFile) return;

    try {
      const uploaded = await uploadImage(selectedFile);

      if (!uploaded) return;

      const uploadFood = await uploadImageMetaData(
        uploaded.key,
      );

      if (!uploadFood) return;

      setFoodList((prev) => [
        uploadFood,
        ...prev,
      ]);

      setName("");
      setDescription("");
      setType("");
      setGrade(0);
      setLocation("");

      setOpenMetaDialog(false);
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleProfileClose = () => {
    setEditableProfile(profileUser);
    setProfileFile(null);
    setOpenProfile(false);
  };

  const handleUserProfileSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUserProfile();

      if (!updatedUser) return;

      setEditableProfile(updatedUser);

      setUser(updatedUser);

      setProfileFile(null);

      setOpenProfile(false);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileFile(file);

    setOpenProfile(true);
  };

  const handleHighlightDelete = async (
    foodItem: FoodItem,
  ) => {
    try {
      const req = await fetch(
        `http://localhost:8000/profile/highlights/${foodItem.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!req.ok) return;

      const data = await req.json();

      setHighlights((prev) =>
        prev.filter(
          (food) => food.id !== data.food_id,
        ),
      );

      setOpen(false);
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleHighlightedItem = (
    index: number,
  ) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Grid
        size={{ xs: 6 }}
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
            mt: { xs: 2, md: 4 },
          }}
        >
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
          >
            <Avatar
              id="profile_img"
              src={profileUser.url ?? ""}
              sx={{
                width: {
                  xs: 48,
                  sm: 56,
                  md: 64,
                  lg: 80,
                },
                height: {
                  xs: 48,
                  sm: 56,
                  md: 64,
                  lg: 80,
                },
              }}
            />

            <Box>
              <Typography>
                {profileUser.user_name}
              </Typography>

              <Typography>
                {profileUser.full_name}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
              >
                <Stack alignItems="center">
                  <Typography>
                    {foodList.length}
                  </Typography>

                  <Typography>
                    Posts
                  </Typography>
                </Stack>

                <Stack alignItems="center">
                  <Typography>
                    {followers.length}
                  </Typography>

                  <Typography>
                    Followers
                  </Typography>
                </Stack>

                <Stack alignItems="center">
                  <Typography>
                    {following.length}
                  </Typography>

                  <Typography>
                    Following
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {isOwnProfile ? (
            <Button
              onClick={() =>
                setOpenProfile(true)
              }
            >
              Edit Profile
            </Button>
          ) : (
            <Button>Follow</Button>
          )}

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ mt: 2 }}
          >
            <IconButton
              sx={{ color: "white" }}
              onClick={handlePrev}
            >
              ←
            </IconButton>

            <Box display="flex" gap={1}>
              {visibleFoods.map(
                (food, index) => (
                  <Avatar
                    key={food.id}
                    src={food.url}
                    onClick={() =>
                      handleHighlightedItem(
                        page * PAGE_SIZE +
                          index,
                      )
                    }
                    sx={{
                      width: {
                        xs: 40,
                        sm: 48,
                        md: 56,
                      },
                      height: {
                        xs: 40,
                        sm: 48,
                        md: 56,
                      },
                      cursor: "pointer",
                    }}
                  />
                ),
              )}
            </Box>

            <IconButton
              sx={{ color: "white" }}
              onClick={handleNext}
            >
              →
            </IconButton>
          </Box>
        </Box>
      </Grid>

      <Grid
        size={12}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={{
            xs: 4,
            sm: 6,
            md: 8,
            lg: 10,
          }}
        >
          <Link
            href={`/profile/${editableProfile.user_name}/`}
          >
            <AppsIcon
              sx={{
                height: "4em",
                display: "flex",
                cursor: "pointer",
              }}
            />
          </Link>

          <Link
            href={`/profile/${editableProfile.user_name}/favorites`}
          >
            <BookmarkIcon
              sx={{
                height: "4em",
                cursor: "pointer",
              }}
            />
          </Link>

          <Link
            href={`/profile/${editableProfile.user_name}/newItem`}
          >
            <ChecklistIcon
              sx={{
                height: "4em",
                cursor: "pointer",
              }}
            />
          </Link>

          <Link
            href={`/profile/${editableProfile.user_name}/topTen`}
          >
            <Timer10SelectIcon
              sx={{
                height: "4em",
                cursor: "pointer",
              }}
            />
          </Link>

          <Link
            href={`/profile/${editableProfile.user_name}/search`}
          >
            <SearchIcon
              sx={{
                height: "4em",
                cursor: "pointer",
              }}
            />
          </Link>
        </Stack>
      </Grid>

      <Dialog
        open={openMetaDialog}
        onClose={handleClose}
      >
        <DialogTitle>
          Foodie Item
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Enter some basic information to
            remember about this experience
          </DialogContentText>
        </DialogContent>

        <form onSubmit={handleSubmit}>
          <Stack sx={{ m: 2 }} spacing={2}>
            <TextField
              label="Restaurant Name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <TextField
              label="Menu Item Description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
            />

            <TextField
              label="Type"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            />

            <TextField
              label="Overall Grade"
              type="number"
              value={grade}
              onChange={(event) =>
                setGrade(
                  parseInt(
                    event.target.value,
                  ),
                )
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 5,
                },
              }}
            />

            <TextField
              label="Location"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value,
                )
              }
            />
          </Stack>

          <DialogActions>
            <Button type="submit">
              Submit
            </Button>

            <Button onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openProfile}
        onClose={handleProfileClose}
      >
        <DialogTitle>
          Edit Profile
        </DialogTitle>

        <DialogContent>
          <form
            onSubmit={
              handleUserProfileSubmit
            }
          >
            <Stack
              direction="row"
              sx={{ m: 2 }}
              spacing={2}
            >
              <Avatar
                id="profile_img"
                src={
                  editableProfile.url ?? ""
                }
                sx={{
                  width: {
                    xs: 48,
                    sm: 56,
                    md: 64,
                    lg: 80,
                  },
                  height: {
                    xs: 48,
                    sm: 56,
                    md: 64,
                    lg: 80,
                  },
                }}
              />

              <Button
                variant="contained"
                component="label"
              >
                Upload Image

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </Button>
            </Stack>

            <Stack spacing={2}>
              <TextField
                multiline
                value={
                  editableProfile.bio ??
                  ""
                }
                onChange={(event) =>
                  setEditableProfile(
                    (prev) => ({
                      ...prev,
                      bio: event.target.value,
                    }),
                  )
                }
                sx={{ m: 2 }}
                placeholder="Update Bio"
              />

              <TextField
                value={
                  editableProfile.phone_number
                }
                onChange={(event) =>
                  setEditableProfile(
                    (prev) => ({
                      ...prev,
                      phone_number:
                        event.target.value,
                    }),
                  )
                }
                sx={{ m: 2 }}
                placeholder="Phone Number"
              />
            </Stack>

            <DialogActions>
              <Button type="submit">
                Submit
              </Button>

              <Button
                onClick={
                  handleProfileClose
                }
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <ProfileFoodDialog
        foodList={highlights}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        open={open}
        setOpen={setOpen}
        onDelete={handleHighlightDelete}
      />
    </>
  );
}
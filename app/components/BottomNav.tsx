"use client";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { RefObject } from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";

interface BottomNavProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  setUploadType: React.Dispatch<React.SetStateAction<string>>;
}

export default function BottomNav({
  fileInputRef,
  setUploadType,
}: BottomNavProps) {
  const [openUploadTypeDialog, setOpenUploadTypeDialog] = useState(false);
  const router = useRouter();

  const uploadArray = ["Post", "Try Later"];

  const handleListItemClick = (item: string) => {
    setUploadType(item);

    setOpenUploadTypeDialog(false);

    // 🔥 manually trigger file input
    if (fileInputRef) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Grid size={12} m={2}>
      {openUploadTypeDialog && (
        <List
          sx={{
            position: "fixed",
            bottom: 70, // 👈 sits above the bottom nav
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 1300, // 👈 above everything
            backgroundColor: "black",
            color: "white",
          }}
        >
          {uploadArray.map((item) => (
            <ListItem disablePadding key={item}>
              <ListItemButton onClick={() => handleListItemClick(item)}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation sx={{ width: "100%" }}>
          <BottomNavigationAction
            value="add"
            icon={<HomeIcon fontSize="large" />}
            onClick={() => router.push("/feed")}
          />
          <BottomNavigationAction
            value="add"
            icon={<AddCircleOutlineIcon fontSize="large" />}
            onClick={() => setOpenUploadTypeDialog(true)}
          />
          <BottomNavigationAction
            value="add"
            icon={<SearchIcon fontSize="large" />}
            onClick={() => router.push("/users")}
          />
          <BottomNavigationAction
            value="add"
            icon={<AccountCircleIcon fontSize="large" />}
            onClick={() => router.push("/profile")}
          />
          <BottomNavigationAction
            value="add"
            icon={<SettingsIcon fontSize="large" />}
            onClick={() => router.push("/profile")}
          />
        </BottomNavigation>
      </Paper>
    </Grid>
  );
}

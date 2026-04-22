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
import { useState } from "react";
import { RefObject } from "react";

interface BottomNavProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  // selectedFile: File | null;
  // setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;

  // openMetaDialog: boolean;
  setUploadType: React.Dispatch<React.SetStateAction<string>>;
}

export default function BottomNav({ fileInputRef, setUploadType}: BottomNavProps) {
  const [openUploadTypeDialog, setOpenUploadTypeDialog] = useState(false);
  // const [uploadArray, setUploadArray] = useState(["Post", "Try Later"])

  const uploadArray = ["Post", "Try Later"];
  // const [uploadType, setUploadType] = useState("");

  const handleListItemClick = (item: string) => {
    setUploadType(item);

    setOpenUploadTypeDialog(false);

    // 🔥 manually trigger file input
    if (fileInputRef) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Grid size={12}>
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
            backgroundColor: 'black',
            color: 'white'
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
            icon={<AddCircleOutlineIcon fontSize="large" />}
            onClick={() => setOpenUploadTypeDialog(true)}
          />
        </BottomNavigation>
      </Paper>
    </Grid>
  );
}

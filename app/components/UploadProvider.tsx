"use client";

import { useRef, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import BottomNav from "./BottomNav";
import { FoodItem, User, Following, Followers } from "../schemas/schemas";

interface UploadProviderProps {
  user: User;
  following: Following[];
  followers: Followers[];
  highlights: FoodItem[];
  children: React.ReactNode;

  // fileInputRef: HTMLInputElement | null;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (uploadType == "Post") {
      const selected = e.target.files?.[0];
      if (!selected) return;

      setSelectedFile(selected);
      // setPreview(URL.createObjectURL(selected));

      setOpenMetaDialog(true);
    }
  }

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
      {children} {/* 👈 everything in between */}
      <BottomNav
        fileInputRef={fileInputRef}
        setUploadType={setUploadType}
        // setOpenMetaDialog={setOpenMetaDialog}
      />
      <input type="file" hidden ref={fileInputRef} onChange={handleChange} />
    </>
  );
}

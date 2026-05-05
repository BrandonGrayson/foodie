"use client";
import BottomNav from "../components/BottomNav";
import Users from "../components/Users";
import { useState, useRef } from "react";

export default function UsersProviders() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState("");
  return (
    <>
      <Users />
      <BottomNav fileInputRef={fileInputRef} setUploadType={setUploadType} />
    </>
  );
}

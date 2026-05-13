"use client";
import BottomNav from "../components/BottomNav";
import Users from "../components/Users";
import { useState, useRef } from "react";
import { User } from "../schemas/schemas";

export default function UsersProviders() {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState("");
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <>
      <Users />
      <BottomNav fileInputRef={fileInputRef} setUploadType={setUploadType} />
    </>
  );
}

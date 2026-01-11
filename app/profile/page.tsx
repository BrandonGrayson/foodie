import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserProfile from "../components/UserProfile";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch("http://localhost:8000/me", {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  console.log("res", res);

  if (!res.ok) {
    redirect("/");
  }

  const user = await res.json();

  console.log("user", user);
  return (
    <>
      <h1>Profile</h1>
      <UserProfile />
    </>
  );
}

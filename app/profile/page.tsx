import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserProfile from "../components/UserProfile";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const API_KEY = process.env.PEXELS_API_KEY;

  if (!API_KEY) {
    throw new Error("PEXELS_API_KEY is not defined");
  }

  const getFavorites = async () => {
    const req = await fetch(
      "https://api.pexels.com/v1/search?query=Burgers&per_page=12",
      {
        method: "GET",
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    const res = await req.json();

    console.log("res", res);

    return res.photos;
  };

  const favorites = await getFavorites();

  console.log("fav", favorites);

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

  const getuserfoodieImages = async () => {
    const res = await fetch("http://localhost:8000/listfoodieitems", {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    console.log("res", res);

    const foodItems = await res.json();

    return foodItems
  };

  const foodItems = await getuserfoodieImages()

  return (
    <>
      <UserProfile foodItems={foodItems} user={user}/>
    </>
  );
}

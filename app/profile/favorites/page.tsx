import { cookies } from "next/headers";
import FavoritesList from "@/app/components/FavoritesList";

export default async function UserFavorites() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const getUserFavorites = async () => {
    const req = await fetch("http://localhost:8000/foods/favorites", {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
        return "there was an error fetching favorites"
    }

    const data = await req.json()


    return data

  };

  const favorites = await getUserFavorites()
  return (
    <FavoritesList foodList={favorites} />
  )
}

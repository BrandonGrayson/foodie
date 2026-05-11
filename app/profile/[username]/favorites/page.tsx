import { cookies } from "next/headers";
import FavoritesList from "@/app/components/FavoritesList";
import { FoodItem } from "@/app/schemas/schemas";

interface UserFavoritesProps {
  params: {
    username: string;
  };
}

export default async function UserFavorites({params}: UserFavoritesProps) {

 

  const username = params.username

   console.log('username------>', username)

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const getUserFavorites = async () => {
    const req = await fetch(`http://localhost:8000/foods/favorites/${username}`, {
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
    <div style={{ marginBottom: "100px" }}>
      <FavoritesList foodList={favorites} />
    </div>
    
  )
}

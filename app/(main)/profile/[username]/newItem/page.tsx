import { cookies } from "next/headers";
import NewItemsList from "@/app/components/NewItemsList";

interface UserFavoritesProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function NewItem({params}: UserFavoritesProps) {
  const cookieStore = await cookies();
  const { username } = await params;
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const getNewItems = async () => {
    const req = await fetch(`http://localhost:8000/newItem/totry/${username}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!req.ok) {
      return "There was an error fetching Items you want to try later!";
    }

    const data = req.json();

    console.log("data", data);

    return data;
  };

  const newItems = await getNewItems();

  console.log("newItems", newItems);
  return (
    <div style={{ marginBottom: "100px" }}>
      <NewItemsList newItems={newItems} />
    </div>
  );
}

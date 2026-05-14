import TopTenList from "@/app/components/TopTenList";
import { cookies } from "next/headers";

interface TopTenProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Page({params}: TopTenProps) {
  const cookieStore = await cookies();
  const { username } = await params;
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const getTopTenItems = async () => {
    const req = await fetch(`http://localhost:8000/rank/topten/${username}`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      console.log("There was an error fetching Top Ten Items");
      return [];
    }

    const topTenItemsList = await req.json();

    return topTenItemsList;
  };

  const topTenItems = await getTopTenItems();

  return (
    <div style={{ marginBottom: "100px" }}>
      <TopTenList topTenList={topTenItems} />
    </div>
  );
}

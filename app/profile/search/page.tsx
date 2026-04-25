import Search from "@/app/components/Search"
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const getTopTenItems = async () => {
    const req = await fetch("http://localhost:8000/rank/topten", {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      console.log("There was an error fetching Top Ten items")
      return []

    }

    const topTenItemsList = await req.json();

    return topTenItemsList
  };

  const topTenItems = await getTopTenItems()
    return (
        <Search topTenItems={topTenItems} />
    )
}




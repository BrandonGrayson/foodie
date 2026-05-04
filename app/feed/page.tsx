import { cookies } from "next/headers";
import UserFeed from "../components/UserFeed";
import BottomNav from "../components/BottomNav";

export default async function Page() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const getUserFeed = async () => {
    const req = await fetch("http://localhost:8000/profile/feed", {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      console.log("There was an error fetching Feed items");
      return [];
    }

    const feed = await req.json();

    return feed;
  };

  const feedItems = await getUserFeed();

  return (
    <>
      
      <UserFeed feed={feedItems} />
      {/* <BottomNav /> */}
    </>
  );
}

// import ProfileHeader from "../components/ProfileHeader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ProfileProviders from "../providers/providers";
// import BottomNav from "../components/BottomNav";
import UploadProvider from "../components/UploadProvider";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch("http://localhost:8000/profile", {
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

    if (!res.ok) {
      return "There was an error fetching food items";
    }

    const foodItems = await res.json();

    console.log("layout food", foodItems);

    return foodItems;
  };

  const foodItems = await getuserfoodieImages();

  const getUserFollowing = async () => {
    const req = await fetch("http://localhost:8000/users/following", {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      return "There was an error fetching user following";
    }

    const res = await req.json();

    const following = res;

    return following;
  };

  const following = await getUserFollowing();

  console.log("following", following);

  const getUserFollowers = async () => {
    const req = await fetch("http://localhost:8000/users/followers", {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      return "There was an error fetching user followers";
    }

    const res = await req.json();

    const followers = res;

    return followers;
  };

  const followers = await getUserFollowers();

  const getHighlights = async () => {
    const req = await fetch("http://localhost:8000/profile/highlights", {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      return "There was an error fetching Highlighted Items";
    }

    const data = await req.json();

    return data
  };

  const highlights = await getHighlights();

  const getTryLater = async () => {
    const req = await fetch("http://localhost:8000/newItem/totry/", {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!req.ok) {
      return "There was an error fetching Highlighted Items";
    }

    const data = await req.json();

    return data
  }

  const tryLaterItems = await getTryLater()

  return (
    <ProfileProviders initialFoodList={foodItems} user={user} tryLater={tryLaterItems}>
      <div
        style={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}
      >

        <UploadProvider
          user={user}
          followers={followers}
          following={following}
          highlights={highlights}
        >
          {children}
          </UploadProvider>
        {/* <ProfileHeader
          user={user}
          followers={followers}
          following={following}
          highlights={highlights}
        />
        {children}
        <BottomNav /> */}
      </div>
    </ProfileProviders>
  );
}

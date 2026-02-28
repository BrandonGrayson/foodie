import ProfileHeader from "../components/ProfileHeader"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ProfileProviders from "../providers/providers";

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
    
        const foodItems = await res.json();

        console.log('layout food', foodItems)
    
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
    
        const res = await req.json();
    
        const followers = res;
    
        return followers;
      };
    
      const followers = await getUserFollowers()
    
    return (
        <ProfileProviders initialFoodList={foodItems}>
        <div style={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}>
            <ProfileHeader user={user} followers={followers} following={following} /> 
            {children}
        </div>
        </ProfileProviders>

    )
}
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import UserProfile from "../components/UserProfile";
import UserFoodList from "../components/UserFoodList";

export default async function ProfilePage() {

  return (
      <UserFoodList />
  );
}

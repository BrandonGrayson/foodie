import { cookies } from "next/headers";

export default async function NewItem() {
  // const cookieStore = await cookies();
  // const cookieHeader = cookieStore
  //   .getAll()
  //   .map((cookie) => `${cookie.name}=${cookie.value}`)
  //   .join("; ");

  // const getNewItems = async () => {
  //   const req = await fetch("http://localhost:8000/newItem/totry/", {
  //     method: "GET",
  //     headers: {
  //       Cookie: cookieHeader,
  //     },
  //   });

  //   if (!req.ok) {
  //     return "There was an error fetching Items you want to try later!";
  //   }

  //   const data = req.json();

  //   console.log("data", data);

  //   return data;
  // };

  // const newItems = await getNewItems();

  // console.log("newItems", newItems);
  return <h1>New Item</h1>;
}

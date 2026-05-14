import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainProvider from "../providers/MainProvider";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode
}

export default async function MainLayout({children}: MainLayoutProps) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

    const res = await fetch(`http://localhost:8000/profile/me`, {
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

    return (
        <MainProvider user={user}>
            {children}
        </MainProvider>
    )
}

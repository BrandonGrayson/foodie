"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";

import { User } from "../schemas/schemas";

interface MainUIContextType {
    user: User | null;
}

interface MainProviderProps {
    user: User | null
    children: ReactNode
}

const UserContext = createContext<MainUIContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUIMain must be used within app folder");
  }

  return context;
}

export default function MainProvider({user, children}: MainProviderProps) {
    return (
        <UserContext.Provider value={{user}} >
            {children}
        </UserContext.Provider>
    )   
}

"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState
} from "react";

import { User } from "../schemas/schemas";

interface MainUIContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

interface MainProviderProps {
    user: User;
    children: ReactNode;
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
    const [currentUser, setCurrentUser] = useState(user);
    return (
        <UserContext.Provider value={{user: currentUser, setUser: setCurrentUser}} >
            {children}
        </UserContext.Provider>
    )   
}

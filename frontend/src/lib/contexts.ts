import type { ThemeContextType, UserContextType } from "./types";
import { createContext } from "react";

export const UserContext = createContext<UserContextType>({
  userContext: null,
  changeUser: () => {},
});

export const ThemeContext = createContext<ThemeContextType | null>(null);
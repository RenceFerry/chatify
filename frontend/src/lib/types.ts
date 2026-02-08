
export type ThemeContextType = {
  theme: string;
  changeTheme: () => void;
}

export type UserType = {
  username: string;
  id: string;
  email: string;
  image: string | null;
  bio: string | null;
}

export type UserContextType = {
  userContext: UserType | null;
  changeUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

import { useState, useEffect, useRef, createContext } from "react"
import { Loading } from "./components/loading"
import { Routes, Route, useNavigate } from "react-router-dom"
import { WelcomePage } from "./pages/welcomePage";
import Login from "./pages/auth/login";
import Signup from './pages/auth/signup';
import Verify from './pages/auth/verify';
import ProtectedRoutes from "./pages/protectedRoutes";
import UnprotectedRoutes from "./pages/unprotectedRoutes";
import Home from './pages/home/home';
import { QueryClientProvider } from '@tanstack/react-query';
import type { UserContextType, ThemeContextType, UserType } from "./lib/types";
import { queryClient } from "./lib/tansStackQuery";
import { BACKEND_URL } from "./utils/helpers";

const UserContext = createContext<UserContextType>({
  userContext: null,
  changeUser: () => {},
});
const ThemeContext = createContext<ThemeContextType | null>(null);

function App() {
  let themeStore = localStorage.getItem("theme");
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const navigate = useNavigate();

  if (!themeStore) {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeStore = isDark ? "dark" : "light";
  }
  
  const [ theme, setTheme ] = useState(themeStore || (isDark ? "dark" : "light"));
  const [ userContext, changeUser ] = useState<UserType | null>(null);
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("light", theme === "light");
  const firstVisit = useRef(localStorage.getItem('firstVisit') || true);

  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }
  
  useEffect(() => {
    if (!(firstVisit.current === 'false')) {
      firstVisit.current = 'false';
      localStorage.setItem('firstVisit', 'false');
      navigate('/');
    }
  }, [firstVisit, navigate]) 

  useEffect(() => {
    document.title = 'Chatify';

    const getUser = async () => {
      const response = await fetch(`${BACKEND_URL}/api/getUser`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) return;
      const user = await response.json();

      changeUser(user);
    }
    getUser();
  }, [])


  return (
    <ThemeContext.Provider value={{theme, changeTheme}}>
    <UserContext.Provider value={{userContext, changeUser}}> 
    <QueryClientProvider client={queryClient}>
      <div className="w-dvw h-dvh light roboto relative">
        <Routes>
          <Route element={<UnprotectedRoutes />}>
            <Route path='/loading' element={<Loading />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verify" element={<Verify />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/:id/*" element={<Home />} />
          </Route>
        </Routes>
        <button type="button" title="theme" className="absolute bottom-3 left-3 z-50 text-text" onClick={changeTheme}>toggle theme</button>
      </div>
    </QueryClientProvider>
    </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
export { ThemeContext, UserContext };

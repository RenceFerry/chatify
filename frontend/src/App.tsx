import { useState, useEffect, createContext } from "react"
import { Loading } from "./components/loading"
import { Routes, Route, useNavigate } from "react-router-dom"
import { WelcomePage } from "./pages/welcomePage";
import Login from "./pages/auth/login";
import Signup from './pages/auth/signup';
import Verify from './pages/auth/verify';
import ProtectedRoutes from "./components/protectedRoutes";
import UnprotectedRoutes from "./components/unprotectedRoutes";
import Home from './pages/home/home'

type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function App() {
  const navigate = useNavigate();
  let themeStore = localStorage.getItem("theme");
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!themeStore) {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeStore = isDark ? "dark" : "light";
  }
  
  const [ theme, setTheme ] = useState(themeStore || (isDark ? "dark" : "light"));
  const [ loading, setLoading ] = useState(true);
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("light", theme === "light");
  const firstVisit = localStorage.getItem('firstVisit') || true;

  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }
  
  useEffect(() => {
    document.title = "Chatify";
    setTimeout(() => setLoading(false), 1000);
  }, [])

  if (!(firstVisit === "false")) navigate('/welcome');

  return (
    <ThemeContext value={{theme, setTheme}}>
      <div className="w-dvw h-dvh light roboto relative">
        {
          loading ? <Loading /> :
          <Routes>
            <Route element={<UnprotectedRoutes />}>
              <Route path='/loading' element={<Loading />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/verify" element={<Verify />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        }
        <button type="button" title="theme" className="absolute bottom-3 left-3 z-50" onClick={changeTheme}>toggle theme</button>
      </div>
    </ThemeContext>
  )
}

export default App

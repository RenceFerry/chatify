import { useState, useEffect, use } from "react"
import { Loading } from "./components/loading"
import { Routes, Route, Link, Navigate } from "react-router-dom"
import { WelcomePage } from "./components/welcomePage";

function App() {
  const [ loading, setLoading ] = useState(true);
  let firstVisit = false;

  if (localStorage.getItem("firstVisit") == null) {
    firstVisit = true;
    localStorage.setItem("firstVisit", "false");
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="w-screen h-screen light roboto">
      {
        loading ? <Loading /> :
        firstVisit ? <WelcomePage /> :
        <Routes>
          <Route path='/ll' element={<Loading />} />
          <Route path="/welcome" element={<WelcomePage />} />
        </Routes>
      }
    </div>
  )
}

export default App

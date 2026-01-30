import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import { useEffect } from "react";
import { checkHealth } from "./services/health";
import './App.css'

function App() {
  useEffect(() => {
    checkHealth()
      .then(data => console.log("Backend respondeu", data))
      .catch(err => console.error("Error:", err))
  }, [])


  return (
    <>
    <Login /> 
    <hr></hr>
    <Register />
      
    </>
  )
}

export default App

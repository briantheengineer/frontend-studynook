import { use, useState } from 'react'
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
    <><h1>BackendChat</h1>
      
    </>
  )
}

export default App

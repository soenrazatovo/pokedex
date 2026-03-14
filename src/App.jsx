import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState } from "react"

import InfoPokemon from "./InfoPokemon.jsx"
import Search from "./Search.jsx"

import './App.css'

function App() {
  const [currentPokemon, setCurrentPokemon] = useState()

  return (
    <>
      <BrowserRouter>

      <Routes>
        <Route path="/" element={<Search  onPokemonClick={(value)=>{setCurrentPokemon(value)}} />} />
        <Route path="/info" element={<InfoPokemon pokemon={currentPokemon} />} />
      </Routes>
      
    </BrowserRouter>

    </>
  )
}

export default App

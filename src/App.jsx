import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './App.css'

import InfoPokemon from "./InfoPokemon.jsx"
import Search from "./Search.jsx"
import { useEffect, useState } from "react"

// https://pokeapi.co/api/v2/

function App() {
  const [currentPokemon, setCurrentPokemon] = useState()

  return (
    <>
      <BrowserRouter>

      {/* <nav>
        <Link to="/">Search</Link> | {" "}
        <Link to="/info">Info</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Search  onPokemonClick={(value)=>{setCurrentPokemon(value)}} />} />
        <Route path="/info" element={<InfoPokemon pokemon={currentPokemon} />} />
      </Routes>
      
    </BrowserRouter>

    </>
  )
}

export default App

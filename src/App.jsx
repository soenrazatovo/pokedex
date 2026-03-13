import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './App.css'

import InfoPokemon from "./InfoPokemon.jsx"
import Search from "./Search.jsx"

// https://pokeapi.co/api/v2/

function App() {
  return (
    <>
      <BrowserRouter>

      <nav>
        <Link to="/">Search</Link> | {" "}
        <Link to="/info">Info</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Search   />} />
        <Route path="/info" element={<InfoPokemon />} />
      </Routes>
      
    </BrowserRouter>

    </>
  )
}

export default App

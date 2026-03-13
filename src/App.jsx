import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './App.css'

import InfoPokemon from "./InfoPokemon.jsx"

// https://pokeapi.co/api/v2/

function App() {
  return (
    <>
      <BrowserRouter>
      {/* <Header user={user} contents={contents}/> */}
      <nav>
        <Link to="/">Search</Link> | {" "}
        <Link to="/info">Info</Link>
      </nav>

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/info" element={<InfoPokemon />} />
      </Routes>
      
    </BrowserRouter>

    </>
  )
}

export default App

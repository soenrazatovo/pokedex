import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import InfoPokemon from "./InfoPokemon.jsx"
import Search from "./Search.jsx"

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>

      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/info" element={<InfoPokemon />} />
      </Routes>
      
    </BrowserRouter>

    </>
  )
}

export default App

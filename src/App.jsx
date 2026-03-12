// import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState } from 'react';
import './App.css'

import Divider from "./Divider.jsx"

// https://pokeapi.co/api/v2/

function App() {
  const numberGen = 6;
  const [currentDivider, setCurrentDivider] = useState(1)

  const Dividers = []
  for(let i = 1; i <= numberGen; i++){
      Dividers.push(
        <Divider key={i} onClick={()=>{setCurrentDivider(i); console.log(i)}} zIndex={currentDivider == i ? numberGen : numberGen-i} width={200} height={200} borderRadius={150} text={"Gen " + i} textSize={"3rem"} textColor={"white"} backgroundColor={"#e26767"} borderColor={"#DD0000"}  borderSize={"4"} topCorner={i != 1} bottomCorner={i != numberGen}/>
      )
  }

  return (
    <>
      <h1>Poke API</h1>
      <div>{Dividers}</div>
      {/* <Divider zIndex={0} width={200} height={200} borderRadius={150} text={"Gen 4"} textSize={"4rem"} textColor={"white"} backgroundColor={"#e26767"} borderColor={"#DD0000"}  borderSize={"4"} topCorner={false}/> */}
      {/* <Divider zIndex={-1} width={200} height={200} borderRadius={150} text={"Gen 4"} textSize={"4rem"} textColor={"white"} backgroundColor={"#e26767"} borderColor={"#DD0000"}  borderSize={"4"}/> */}
      

    </>
  )
}

export default App

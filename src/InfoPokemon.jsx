import { useState } from 'react';
import Divider from "./Divider.jsx"

function InfoPokemon() {
  const numberGen = 6;
  const [currentDivider, setCurrentDivider] = useState(1)

  const activeColor = {text:"white",background:"#e26767",border:"#DD0000"}
  const mutedColor = {text:"grey",background:"#a94c4c",border:"#9d0000"}

  const borderSize = 6
  const borderRadius = 50


  const Dividers = []
  for(let i = 1; i <= numberGen; i++){
    if (currentDivider == i){
      Dividers.push(
        <Divider key={i} onClick={()=>{setCurrentDivider(i); console.log(i)}} zIndex={numberGen+1} width={200} height={200} borderRadius={borderRadius} text={"Gen " + i} textSize={"3rem"} textColor={activeColor.text} backgroundColor={activeColor.background} borderColor={activeColor.border}  borderSize={borderSize} topCorner={i != 1} bottomCorner={i != numberGen}/>
      )
    } else {
      Dividers.push(
        <Divider key={i} onClick={()=>{setCurrentDivider(i); console.log(i)}} zIndex={numberGen-i} width={200} height={200} borderRadius={borderRadius} text={"Gen " + i} textSize={"3rem"} textColor={mutedColor.text} backgroundColor={mutedColor.background} borderColor={mutedColor.border}  borderSize={borderSize} topCorner={i != 1} bottomCorner={i != numberGen}/>
      )
    }
  }

  return (
    <>
      <h1>Poke API</h1>
      <div style={{display: "flex", alignItems: "stretch", margin: "50px"}}>
        <div>{Dividers}</div>
        <div style={{width: 500, zIndex: numberGen,backgroundColor: activeColor.background, outline: borderSize + "px solid "+ activeColor.border, outlineOffset: -borderSize/2 ,transform: "translateX(-"+ (borderSize / 2) +"px)", filter: "drop-shadow(-6px 12px 4px rgba(83, 83, 83, 0.4))"}}></div>
      </div>

    </>
  )
}

export default InfoPokemon;
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom"
import { useEffect, useState } from "react"

import InfoPokemon from "./InfoPokemon.jsx"
import Search from "./Search.jsx"

import './App.css'

function App() {
    const [allTypes, setAllTypes] = useState()

    function ucwords(string){
        return string.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
    }

    async function fetchURL(url){
        try {
            const res = await fetch(url, {headers: {"Method" : "GET", "Accept" : "application/json"}})
            const data = await res.json()
            return data
        } catch(err) {
            console.error(err)
        }
    }

    async function fetchAllTypes() {
        const allTypesData = await fetchURL("https://pokeapi.co/api/v2/type?limit=18")
        const newallTypes = await Promise.all(allTypesData.results.map(async (type) => await fetchURL(type.url)))
        setAllTypes(newallTypes)
    }

    useEffect(()=>{
        fetchAllTypes()
    },[])

    return (
        <>
            <HashRouter>

                {allTypes &&
                    <Routes>    
                        <Route path="/" element={<Search allTypes={allTypes}/>} />
                        <Route path="/info" element={<InfoPokemon allTypes={allTypes}/>} />
                    </Routes>
                }

            </HashRouter>

        </>
    )
}

export default App

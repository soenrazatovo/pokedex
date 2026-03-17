import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useKeyPress from "../includes/useKeyPress.jsx"
import './Search.css'

function Search({allTypes}) {
    const isEnterPressed = useKeyPress("Enter")

    const [allPokemons, setAllPokemons] = useState()

    const [currentName, setCurrentName] = useState("")
    const [currentType, setCurrentType] = useState()

    const [searchedPokemons, setSearchedPokemons] = useState([])
    const [showedPokemons, setShowedPokemons] = useState([])

    const [dropdown, setDropdown] = useState(false)
    const [showShiny, setShowShiny] = useState(false)

    const [currentPage, setCurrentPage] = useState(0)
    const pokemonPerPage = 20
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    }
    
    const toggleDropdown = () => {setDropdown(dropdown => !dropdown)}
    
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
    
    async function fetchAllPokemons(){
        const pokemonsData = await fetchURL("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
        setAllPokemons(pokemonsData.results)
    }

    function searchPokemons(){
        if (allPokemons){
            const pokemonList = currentType 
            ? currentType.pokemon.map(poke => (poke.pokemon))
            : allPokemons

            const newSearchedPokemons = pokemonList.filter((pokemon) => pokemon.name.includes(currentName.toLowerCase()))
                
            if (JSON.stringify(newSearchedPokemons) != JSON.stringify(searchedPokemons)){
                setSearchedPokemons(newSearchedPokemons)
    
                if (currentPage!=0){
                    setCurrentPage(0)
                }
            }
        }
    }

    async function updatePagination(){
        setShowedPokemons()
        
        const pokemonsOnPage = searchedPokemons.filter((_,index) => currentPage*pokemonPerPage <= index && index < (currentPage+1)*pokemonPerPage)
        const pokemonsOnPageFetch = await Promise.all(pokemonsOnPage.map((pokemonOnPage)=> fetchURL(pokemonOnPage.url)))
        
        setShowedPokemons(pokemonsOnPageFetch)
    }

    useEffect(()=>{
        fetchAllPokemons()
        document.title = "Pokedex"
    },[])

    useEffect(()=>{
        searchPokemons()
    },[allPokemons, currentType])
    
    useEffect(()=>{
        updatePagination()
    },[currentPage, searchedPokemons])

    useEffect(()=>{
        if (isEnterPressed) {
            searchPokemons()
        }
    },[isEnterPressed])

    return (
        <>  
            <div className={"search-bar"}>
                
                <div className="search-input">
                    <input className="search-text" type="text" value={currentName} placeholder={"Search by name ..."} onChange={(e)=>{setCurrentName(e.target.value)}}/>
                    <button className="search-erase" onClick={()=>{setCurrentName("")}}> &#x00D7; </button>
                    <button className="search-submit" onClick={()=>{searchPokemons()}}> &#128269; </button>
                </div>
                
                <div className={"type-dropdown"}>
                    {currentType ?
                        <img className={"type-selected"} src={currentType.sprites["generation-viii"]["legends-arceus"]["name_icon"]} onClick={toggleDropdown}/>
                    :    
                        <h1 className={"type-selected"} onClick={toggleDropdown}>-- Type --</h1>
                    }
                    
                    <div className={"type-choices"} style={{display: dropdown ? "flex" : "none"}}>
                        {currentType != undefined &&
                            <h1 onClick={()=>{setCurrentType(); setDropdown(!dropdown)}}>-- None --</h1>
                        }
                        {allTypes && allTypes.map((type,index) => ( 
                            currentType != type &&
                            <img key={index} src={type.sprites["generation-viii"]["legends-arceus"]["name_icon"]} onClick={()=>{setCurrentType(type); setDropdown(!dropdown)}}/>   
                        ))}
                    </div>
                </div>
                    
                <div className="toggle-shiny">
                    <input type="checkbox" name="toggle-shiny" value={showShiny} onClick={()=>{setShowShiny(showShiny => !showShiny)}}/>
                    <label htmlFor="toggle-shiny">Show shiny</label>
                </div>
            </div>
            

            {showedPokemons ?
                <div className="pokemon-grid">
                    {showedPokemons.map((currentPokemon,index) => {
                        const mainType = currentPokemon.types[0]?.type?.name
                        const cardColor = typeColors[mainType]
                        return (
                            <div key={index} className="pokemon-card" style={{ background: `linear-gradient(180deg, ${cardColor}33 0%, #ffffff 100%)`, borderColor: cardColor}}>
                                <div className="card-header">
                                    <div>
                                        <h2>{ucwords(currentPokemon.name)}</h2>
                                        <p className="pokedex-number">N°{currentPokemon.order >= 0 ? currentPokemon.order.toString().padStart(4, "0") : "????"}</p>
                                    </div>
                                    <div className="types">
                                        {allTypes && currentPokemon.types.map((typeInfo, index) => {
                                            const typeId = typeInfo.type.url.split("/")[6]
                                            const typeIcon = allTypes[typeId - 1].sprites["generation-viii"]["legends-arceus"]["name_icon"]
                                            return (
                                                <img
                                                    key={index}
                                                    src={typeIcon}
                                                    alt={typeInfo.type.name}
                                                    className="type-icon"
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="card-body">
                                    <img className="pokemon-artwork" src={currentPokemon.sprites.other["official-artwork"][showShiny ? "front_shiny" : "front_default"]} alt="Missing official artwork" />
                                    <Link className="info-link" to={"/info?id="+currentPokemon.id}>More ...</Link>
                                </div>
                            </div>
                        )})}
                </div>
            :
                <h1 className="loading-text">Loading ...</h1>
            }

            <nav className={"nav-bar"}>
                <button onClick={()=>{setCurrentPage(currentPage=> currentPage-1);}} disabled={currentPage==0}>Previous</button>
                <h1>{currentPage}</h1>
                <button onClick={()=>{setCurrentPage(currentPage=> currentPage+1);}} disabled={currentPage==Math.floor(searchedPokemons.length/pokemonPerPage)}>Next</button>
            </nav>
        </>
    );
}

export default Search;
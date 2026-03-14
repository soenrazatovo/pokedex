import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Search.css'

function Search({onPokemonClick}) {
    const [allTypes, setAllTypes] = useState()
    const [allPokemons, setAllPokemons] = useState()

    const [currentName, setCurrentName] = useState("")
    const [currentType, setCurrentType] = useState()

    const [searchedPokemons, setSearchedPokemons] = useState([])
    const [showedPokemons, setShowedPokemons] = useState([])

    const [dropdown, setDropdown] = useState(false)

    const [currentPage, setCurrentPage] = useState(0)
    const pokemonPerPage = 20
    
    const toggleDropdown = () => {setDropdown(dropdown => !dropdown)}
    
    function ucwords(string){
        return string.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
    }

    async function fetchURL(url){
        const res = await fetch(url, {headers: {"Method" : "GET", "Accept" : "application/json"}})
        const data = await res.json()
        return data
    }

    async function fetchAllTypes(){
        const allTypesData = await fetchURL("https://pokeapi.co/api/v2/type?limit=18")
        const newallTypes = await Promise.all(allTypesData.results.map(async (type) => await fetchURL(type.url)))
        setAllTypes(newallTypes)
    }

    async function fetchAllPokemons(){
        const pokemonsData = await fetchURL("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
        setAllPokemons(pokemonsData.results)
    }

    function searchPokemons(){
        if (allPokemons){
            const pokemonList = currentType 
            ? currentType.pokemon.map(poke => ({name : poke.pokemon.name, url: poke.pokemon.url}))
            : allPokemons

            const newSearchedPokemons = pokemonList.filter((pokemon) => pokemon.name.includes(currentName.toLowerCase()))
                
            setSearchedPokemons(newSearchedPokemons)

            if (currentPage!=0){
                setCurrentPage(0)
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
        fetchAllTypes()
        fetchAllPokemons()
    },[])

    useEffect(()=>{
        searchPokemons()
    },[allPokemons, currentType])
    
    useEffect(()=>{
        updatePagination()
    },[currentPage, searchedPokemons])

    return (
        <>  
            <nav className={"nav-bar"}>
                <button onClick={()=>{setCurrentPage(currentPage=> currentPage-1);}} disabled={currentPage==0}>Previous</button>
                <h1>{currentPage}</h1>
                <button onClick={()=>{setCurrentPage(currentPage=> currentPage+1);}} disabled={currentPage==Math.floor(searchedPokemons.length/pokemonPerPage)}>Next</button>
            </nav>

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
            </div>
            

            {showedPokemons ? showedPokemons.map((currentPokemon,index) => (
                <div key={index}>
                    <h1>{ucwords(currentPokemon.name)}</h1>
                    <img src={currentPokemon.sprites.other["official-artwork"]["front_default"]}/>
                    <Link to="/info" onClick={()=>{onPokemonClick(currentPokemon)}}>More Info</Link>
                </div>
            )):
                <h1>Loading ...</h1>
            }
        </>
    );
}

export default Search;
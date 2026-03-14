import { use } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Search({onPokemonClick}) {
    const [types, setTypes] = useState()
    const [pokemons, setPokemons] = useState()

    const [textInput, setTextInput] = useState("")
    const [type1, setType1] = useState()

    const [searchedPokemons, setSearchedPokemons] = useState([])
    const [currentPokemons, setCurrentPokemons] = useState([])

    const [dropdown, setDropdown] = useState(false)

    const pokemonPerPage = 20
    const [currentPage, setCurrentPage] = useState(0)
    
    function ucwords(string){
        return string[0].toUpperCase() + string.slice(1)
    }

    async function fetchURL(url){
        const res = await fetch(url, {headers: {"Method" : "GET", "Accept" : "application/json"}})
        const data = await res.json()
        return data
    }

    async function fetchTypes(){
        const typesData = await fetchURL("https://pokeapi.co/api/v2/type?limit=18")
        const newTypes = await Promise.all(typesData.results.map(async (type) => await fetchURL(type.url)))
        setTypes(newTypes)
    }

    async function fetchPokemons(){
        const pokemonsData = await fetchURL("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
        setPokemons(pokemonsData.results)
        searchCurrentPokemons()
    }

    function searchCurrentPokemons(){
        if (pokemons && type1){
            const pokemonsData = type1.pokemon.map(poke => ({name : poke.pokemon.name, url: poke.pokemon.url}))
            const newSearchedPokemons = pokemonsData.filter((pokemonData) => pokemonData.name.includes(textInput.toLowerCase()))
            
            setSearchedPokemons(newSearchedPokemons)
            if (currentPage!=0){
                setCurrentPage(0)
            }

        } else if (pokemons){
            const newSearchedPokemons = pokemons.filter((pokemonData) => pokemonData.name.includes(textInput.toLowerCase()))
            // console.log(textInput, newSearchedPokemons)
            
            setSearchedPokemons(newSearchedPokemons)
            if (currentPage!=0){
                setCurrentPage(0)
            }
        }
    }

    function updatePagination(){
        const showedPokemons = searchedPokemons.filter((pokemonData,index) => currentPage*pokemonPerPage <= index && index < (currentPage+1)*pokemonPerPage)
        console.log(showedPokemons)
        Promise.all(showedPokemons.map((showedPokemon)=> fetchURL(showedPokemon.url)))
        .then(showedPokemonsFetch => setCurrentPokemons(showedPokemonsFetch)/* console.log(showedPokemonsFetch)*/)
    
    }

    useEffect(()=>{
        fetchTypes()
        fetchPokemons()
    },[])

    useEffect(()=>{
        searchCurrentPokemons()
    },[pokemons, type1])
    
    useEffect(()=>{
        updatePagination()
    },[currentPage, searchedPokemons])
    // types && console.log(types)

    console.log(currentPokemons)

    return (
        <>  
            <div>
                <button onClick={()=>{setCurrentPage(currentPage=> currentPage-1);}} disabled={currentPage==0}>Previous</button>
                <h1>{currentPage}</h1>
                <button onClick={()=>{setCurrentPage(currentPage=> currentPage+1);}} disabled={currentPage==Math.floor(searchedPokemons.length/pokemonPerPage)}>Next</button>
            </div>

            <div style={{display: "flex", flexDirection: "row", padding: 8, gap: 8,alignItems: "center"}}>
                <input type="text" value={textInput} onChange={(e)=>{setTextInput(e.target.value)}}/>
                <button onClick={()=>{searchCurrentPokemons()}} >Submit</button>
                <div style={{position:"relative", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {type1 ?
                        <img src={type1.sprites["generation-viii"]["legends-arceus"]["name_icon"]} style={{width: 150, height: 40, border: "1px solid black"}} onClick={()=>setDropdown(!dropdown)}/>
                    :    
                        <h1 onClick={()=>{setDropdown(!dropdown)}} style={{width: 150, height: 40, border: "1px solid black", textAlign: "center", margin: 0}}>-- Type 1 --</h1>
                    }
                    
                    <div style={{position: "absolute", top:40, display: dropdown ? "flex" : "none", flexDirection: "column", border: "1px solid black"}}>
                        <h1 onClick={()=>{setType1(); setDropdown(!dropdown)}} style={{width: 150, height: 40, textAlign: "center", margin: 0}}>None</h1>
                        {types && types.map((type,index) => (
                            <img key={index} onClick={()=>{setType1(type); setDropdown(!dropdown)}} src={type.sprites["generation-viii"]["legends-arceus"]["name_icon"]}/>
                        ))}
                    </div>
                </div>
            </div>
            

            {currentPokemons && currentPokemons.map((currentPokemon,index) => (
                <div key={index}>
                    <h1>{ucwords(currentPokemon.name)}</h1>
                    <img src={currentPokemon.sprites.other["official-artwork"]["front_default"]}/>
                    <Link to="/info" onClick={()=>{onPokemonClick(currentPokemon)}}>More Info</Link>
                </div>
            ))}
        </>
    );
}

export default Search;
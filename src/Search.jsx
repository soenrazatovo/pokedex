import { useEffect, useState } from "react";

function Search() {
    const [types, setTypes] = useState()
    const [pokemons, setPokemons] = useState([])

    const [textInput, setTextInput] = useState("")
    const [type1, setType1] = useState()

    const [dropdown, setDropdown] = useState(false)
    
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
        if (type1){
            const typeData = await fetchURL("https://pokeapi.co/api/v2/type/"+type1.name)
            const pokemonsData = await typeData.pokemon.map(poke => ({name : poke.pokemon.name, url: poke.pokemon.url}))
            setPokemons(pokemonsData.filter(pokemonData => pokemonData.name.includes(textInput.toLowerCase())))
        } else {
            const pokemonsData = await fetchURL("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
            setPokemons(pokemonsData.results.filter(pokemonData => pokemonData.name.includes(name.toLowerCase())))
        }
    }

    useEffect(()=>{
        fetchTypes()
    },[])

    useEffect(()=>{
        fetchPokemons()
    },[textInput,type1])
    
    return (
        <>  
            <div style={{display: "flex", flexDirection: "row", padding: 8, gap: 8,alignItems: "center"}}>
                <input type="text" onChange={(e)=>{setTextInput(e.target.value)}}/>

                <div style={{position:"relative", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {type1 ?
                        <img src={type1.sprites["generation-viii"]["legends-arceus"]["name_icon"]} style={{width: 150, height: 40, border: "1px solid black"}} onClick={()=>setDropdown(!dropdown)}/>
                    :    
                        <h1 onClick={()=>{setType1(); setDropdown(!dropdown)}} style={{width: 150, height: 40, border: "1px solid black", textAlign: "center", margin: 0}}>-- Type 1 --</h1>
                    }
                    
                    <div style={{position: "absolute", top:40, display: dropdown ? "flex" : "none", flexDirection: "column", border: "1px solid black"}}>
                        <h1 onClick={()=>{setType1(); setDropdown(!dropdown)}} style={{width: 150, height: 40, textAlign: "center", margin: 0}}>None</h1>
                        {types && types.map((type,index) => (
                            <img onClick={()=>{setType1(type); setDropdown(!dropdown)}} src={type.sprites["generation-viii"]["legends-arceus"]["name_icon"]}/>
                            
                        ))}
                    </div>
                </div>
            </div>
            

            {pokemons && pokemons.map((pokemon,index) => (
                <h1 key={index}>{ucwords(pokemon.name)}</h1>
            ))}
        </>
    );
}

export default Search;
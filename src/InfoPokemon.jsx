import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Divider from "./Divider.jsx"

function InfoPokemon() {
    const [searchParams] = useSearchParams()
    const [allVarieties, setAllVarietes] = useState()
    const [species, setSpecies] = useState()
    const [indexCurrentVariety, setIndexCurrentVariety] = useState()

    const navigate = useNavigate()

    function ucwords(string){
        return string.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
    }

    async function fetchURL(url) {
        const res = await fetch(url, { headers: { "Method": "GET", "Accept": "application/json" } })
        const data = await res.json()
        return data
    }

    async function fetchPokemon() {
        if (searchParams.get("id") != null && searchParams.get("id") != "") {
            try {

                const currentPokemon = await fetchURL("https://pokeapi.co/api/v2/pokemon/" + searchParams.get("id"))
                const currentSpecies = await fetchURL(currentPokemon.species.url)
                const allVarieties = await Promise.all(currentSpecies.varieties.map(async variety => await fetchURL(variety.pokemon.url)))
                
                for (let i = 0; i < allVarieties.length; i ++){
                    if (allVarieties[i].name == currentPokemon.name){
                        setIndexCurrentVariety(i)
                    }
                }
                
                setAllVarietes(allVarieties)
                setSpecies(currentSpecies)

                console.log(allVarieties, currentSpecies)

            } catch (err) {
                console.error(err)
                navigate("/")
            }

        } else {
            navigate("/")
        }
    }

    useEffect(() => {
        fetchPokemon()
    }, [])
    
    const activeColor = { text: "white", background: "#e26767", border: "#DD0000" }
    const mutedColor = { text: "grey", background: "#a94c4c", border: "#9d0000" }
    const borderSize = 4
    const borderRadius = "45px"

    return (
        <>
            <Link to="/">&lt; Go back to search</Link>
            <h1>Poke API</h1>
            {allVarieties && indexCurrentVariety != undefined && 

                <div style={{ display: "flex", alignItems: "stretch", margin: "50px" }}>
                    <div>
                        {allVarieties.map((variety,index) => {
                            const currentColor = indexCurrentVariety == index ? activeColor : mutedColor
                            return(
                                <Divider key={index} onClick={() => {setIndexCurrentVariety(index)}} zIndex={indexCurrentVariety == index ? allVarieties.length + 1: allVarieties.length - index} width={200} height={200} borderRadius={borderRadius} text={ucwords(variety.name)} textSize={"1.5rem"} textColor={currentColor.text} backgroundColor={currentColor.background} borderColor={currentColor.border} borderSize={borderSize} topCorner={index != 0} bottomCorner={index != allVarieties.length-1} />
                            )                       
                        })}
                    </div>
                    <div style={{ width: 500, zIndex: allVarieties.length, backgroundColor: activeColor.background, outline: borderSize + "px solid " + activeColor.border, outlineOffset: -borderSize / 2, transform: "translateX(-" + (borderSize / 2) + "px)", filter: "drop-shadow(-6px 12px 4px rgba(83, 83, 83, 0.4))" }}>
                        
                        <h1>{ucwords(allVarieties[indexCurrentVariety].name)}</h1>
                        <h3>{species.genera[7].genus}</h3>
                        <h2>{species.flavor_text_entries.filter(entry => (entry.language.name == "en"))[0].flavor_text.replace("\n"," ").replace("\f", " ")}</h2>    
                        <img src={allVarieties[indexCurrentVariety].sprites.other["official-artwork"]["front_default"]} alt="" />
                    </div>
                </div>
            }

        </>
    )
}

export default InfoPokemon;
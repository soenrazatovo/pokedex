import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Divider from "./Divider.jsx"

function InfoPokemon({allTypes}) {
    const [searchParams] = useSearchParams()

    const [species, setSpecies] = useState()
    const [allVarieties, setAllVarietes] = useState()
    const [indexCurrentVariety, setIndexCurrentVariety] = useState()

    const [currentSprites, setCurrentSprites] = useState()
    
    const [gender, setGender] = useState("official")
    const [rarity, setRarity] = useState("default")
    const [indexCurrentSprite, setIndexCurrentSprite] = useState()

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
                    if (allVarieties[i].id == currentPokemon.id){
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

    function updateSprites(){
        const currentSprites = {official: {default:[allVarieties[indexCurrentVariety].sprites.other["official-artwork"]["front_default"]], shiny:[allVarieties[indexCurrentVariety].sprites.other["official-artwork"]["front_shiny"]]},
        male:{default:[], shiny:[]},
        female:{default:[], shiny:[]}}
                        
        for (const [name, url] of Object.entries(allVarieties[indexCurrentVariety].sprites)) {
            if (typeof url == "string"){
                if (name.includes("female")){
                    if (name.includes("shiny")){
                        currentSprites.female.shiny.push(url)
                    }else {
                        currentSprites.female.default.push(url)
                    }
                } else {
                    if (name.includes("shiny")){
                        currentSprites.male.shiny.push(url)
                    }else {
                        currentSprites.male.default.push(url)
                    }
                }
            }
        }
        
        setRarity("default")
        setGender("official")
        setIndexCurrentSprite(currentSprites["official"]["default"].length - 1)
        setCurrentSprites(currentSprites)
    }

    useEffect(() => {
        fetchPokemon()
    }, [])

    useEffect(() => {
        if (allVarieties){
            updateSprites()
        }
    }, [indexCurrentVariety])

    const changeGender = () => {
        if (currentSprites["female"]["default"].length == 0 && currentSprites["female"]["shiny"].length == 0){
            const newGender = gender == "official" ? "male" : "official"
            setGender(newGender)
            setIndexCurrentSprite(currentSprites[newGender]["default"].length - 1)
        } else {
            const newGender = gender == "official" ? "male" : gender == "male" ? "female" : "official"
            setGender(newGender)
            setIndexCurrentSprite(currentSprites[newGender]["default"].length - 1)
        }
        setRarity("default")
    }
    
    const activeColor = { text: "white", background: "#e26767", border: "#DD0000" }
    const mutedColor = { text: "grey", background: "#a94c4c", border: "#9d0000" }
    const borderSize = 4
    const borderRadius = "45px"

    if (currentSprites){
        console.log(gender,rarity,indexCurrentSprite)
    }
    return (
        <>
            <Link to="/">&lt; Go back to search</Link>
            
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

                    <div style={{ zIndex: allVarieties.length, backgroundColor: activeColor.background, outline: borderSize + "px solid " + activeColor.border, outlineOffset: -borderSize / 2, transform: "translateX(-" + (borderSize / 2) + "px)", filter: "drop-shadow(-6px 12px 4px rgba(83, 83, 83, 0.4))", display: "flex", gap: "20px", padding: "20px", borderRadius: "0px 20px 20px 0px" }}>
                        <div style={{ flex: 1 }}>
                            <h1>{ucwords(allVarieties[indexCurrentVariety].name)}</h1>

                            {currentSprites && 
                                <>
                                <button onClick={changeGender}>{ucwords(gender)}</button>
                                
                                {currentSprites[gender]["shiny"].length != 0 &&
                                    <button onClick={()=>{setRarity(rarity == "default" ? "shiny" : "default")}}>{ucwords(rarity)}</button>
                                }
                                </>
                            }


                            <h3>{species.genera.filter(generaObj => (generaObj.language.name == "en"))[0].genus}</h3>
                            {species.habitat &&
                                <h3>Found in : {ucwords(species.habitat.name)}</h3>
                            }
                            <h4>{species.flavor_text_entries.filter(entry => (entry.language.name == "en"))[0].flavor_text.replace("\n"," ").replace("\f", " ")}</h4>
                        </div>

                        <div style={{ width: "240px", backgroundColor: "#fff", color: "#000", borderRadius: "16px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", minHeight: "420px" }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: "6px", width: "100%", flexWrap: "wrap" }}>
                                {allTypes && allVarieties[indexCurrentVariety].types.map((typeInfo, index) => {
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
                            {currentSprites &&
                                <>
                                    <img src={currentSprites[gender][rarity][indexCurrentSprite]} alt="pokemon" style={{ width: "100%", objectFit: "contain"}} />
                                    { (currentSprites[gender][rarity].length - 1) > 0 &&
                                        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                                            <button onClick={()=>{setIndexCurrentSprite(Number(!indexCurrentSprite))}}>&#9664;</button>
                                            <button onClick={()=>{setIndexCurrentSprite(Number(!indexCurrentSprite))}}>&#9654;</button>
                                        </div>
                                    }
                                </>
                            }

                            <div style={{ width: "100%", textAlign: "left", marginTop: "6px" }}>
                                {allVarieties[indexCurrentVariety].stats.map((currentStat,index) => (
                                    <div key={index} style={{ fontSize: "0.8rem", margin: "2px 0" }}>{ucwords(currentStat.stat.name)}: {currentStat.base_stat}</div>
                                ))}
                            </div>
                            <div style={{ width: "100%", borderTop: "1px solid #ddd", marginTop: "8px", paddingTop: "8px", textAlign: "left", fontSize: "0.9rem" }}>
                                <div>Weight: {allVarieties[indexCurrentVariety].weight}</div>
                                <div>Height: {allVarieties[indexCurrentVariety].height}</div>
                            </div>
                        </div>
                    </div>

                </div>
            }

        </>
    )
}

export default InfoPokemon;
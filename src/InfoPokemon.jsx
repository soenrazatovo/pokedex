import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Divider from "./Divider.jsx"
import Bar from './Bar.jsx';

import "./InfoPokemon.css"

function InfoPokemon({ allTypes }) {
    const [searchParams] = useSearchParams()

    const [species, setSpecies] = useState()
    const [allVarieties, setAllVarietes] = useState()
    const [indexCurrentVariety, setIndexCurrentVariety] = useState()

    const [currentSprites, setCurrentSprites] = useState()

    const [gender, setGender] = useState("official")
    const [rarity, setRarity] = useState("default")
    const [indexCurrentSprite, setIndexCurrentSprite] = useState()

    const [evolutionContainer, setEvolutionContainer] = useState()

    const navigate = useNavigate()

    function ucwords(string) {
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

                for (let i = 0; i < allVarieties.length; i++) {
                    if (allVarieties[i].id == currentPokemon.id) {
                        setIndexCurrentVariety(i)
                    }
                }

                fetchEvolutionChain(currentSpecies)

                setAllVarietes(allVarieties)
                setSpecies(currentSpecies)

                // console.log(allVarieties, currentSpecies)

            } catch (err) {
                console.error(err)
                navigate("/")
            }

        } else {
            navigate("/")
        }
    }

    async function fetchEvolutionChain(currentSpecies){
        const evolutionChain = await fetchURL(currentSpecies.evolution_chain.url)
        // console.log(evolutionChain)
        let newContainer = await recursiveEvolutionChain(true,[evolutionChain.chain])
        setEvolutionContainer(newContainer)
    }

    async function recursiveEvolutionChain(firstIteration, chains){
        if (!chains || chains.length === 0) {
            return null
        }

        let isFirstIteration = firstIteration
        if (firstIteration == true) {
            firstIteration = false
        }

        const chainNodes = await Promise.all(chains.map(async chain => {
            const currSpecies = await fetchURL(chain.species.url)
            const baseVariety = await fetchURL(currSpecies.varieties[0].pokemon.url)

            const nextDiv = await recursiveEvolutionChain(firstIteration, chain.evolves_to)

            const curDiv = (
                <div className={"evolution-pokemon"}>
                    <img className={"evolution-img"} src={baseVariety.sprites.other["official-artwork"]["front_default"]} alt={baseVariety.name} />
                    <h3 className={"evolution-name"}>{baseVariety.name}</h3>
                    {chain.evolution_details &&
                        chain.evolution_details.map((evolution_detail,index) => (
                            <h4 key={index} className={"evolution-details"}>
                                {ucwords(evolution_detail.trigger.name)}
                                
                                {evolution_detail.min_level ? " at Lv " + evolution_detail.min_level : ""}
                                {evolution_detail.item ? " => " + ucwords(evolution_detail.item.name) : ""}
                                {evolution_detail.time_of_day ? " during the " + evolution_detail.time_of_day : ""}
                                {evolution_detail.min_happiness ? " with " + evolution_detail.min_happiness + " happiness" : ""}
                                {evolution_detail.location ? " at " + ucwords(evolution_detail.location.name) : ""}
                            </h4>

                        ))
                    }
                    <Link to={"/info?id="+baseVariety.id}> Go to Page </Link>
                </div>
            )

            const chainNode = (
                <div key={chain.species.name} className={"evolution-relation"}>
                    {curDiv}
                    {nextDiv && 
                        <div className={"evolution-next-evolutions"}>{nextDiv}</div>
                    }
                </div>
            )

            return chainNode
        }))

        return (
            <>  
                {!isFirstIteration &&
                    <h1>&darr;</h1>
                }
                <div className={"evolution-level"} style={{marginTop: isFirstIteration ? "32px" : "" }}>
                    {chainNodes}
                </div>
            </>
        )
    }

    function updateSprites() {
        const currentSprites = {
            official: { default: [allVarieties[indexCurrentVariety].sprites.other["official-artwork"]["front_default"]], shiny: [allVarieties[indexCurrentVariety].sprites.other["official-artwork"]["front_shiny"]] },
            male: { default: [], shiny: [] },
            female: { default: [], shiny: [] }
        }

        for (const [name, url] of Object.entries(allVarieties[indexCurrentVariety].sprites)) {
            if (typeof url == "string") {
                if (name.includes("female")) {
                    if (name.includes("shiny")) {
                        currentSprites.female.shiny.push(url)
                    } else {
                        currentSprites.female.default.push(url)
                    }
                } else {
                    if (name.includes("shiny")) {
                        currentSprites.male.shiny.push(url)
                    } else {
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
    }, [searchParams])

    useEffect(() => {
        if (allVarieties && indexCurrentVariety != undefined) {
            updateSprites()
        }
    }, [allVarieties, indexCurrentVariety])

    function changeGender(newGender) {

        setRarity("default")
        setGender(newGender)
        setIndexCurrentSprite(currentSprites[newGender]["default"].length - 1)
    }

    const activeColor = { text: "white", background: "#e26767", border: "#DD0000" }
    const mutedColor = { text: "grey", background: "#a94c4c", border: "#9d0000" }
    const borderSize = 4
    const borderRadius = "45px"

    return (
        <>
            <Link to="/" className="info-back-link">&lt; Go back to search</Link>

            {allVarieties && indexCurrentVariety != undefined &&

                <div className="info-layout">
                    <div>
                        {allVarieties.map((variety, index) => {
                            const currentColor = indexCurrentVariety == index ? activeColor : mutedColor
                            return (
                                <Divider key={index} onClick={() => { setIndexCurrentVariety(index) }} zIndex={indexCurrentVariety == index ? allVarieties.length + 1 : allVarieties.length - index} width={200} height={200} borderRadius={borderRadius} text={ucwords(variety.name)} textSize={"1.5rem"} textColor={currentColor.text} backgroundColor={currentColor.background} borderColor={currentColor.border} borderSize={borderSize} topCorner={index != 0} bottomCorner={index != allVarieties.length - 1} />
                            )
                        })}
                    </div>

                    <div className="info-main-card" style={{ zIndex: allVarieties.length, backgroundColor: activeColor.background, outline: borderSize + "px solid " + activeColor.border, outlineOffset: -borderSize / 2, transform: "translateX(-" + (borderSize / 2) + "px)" }}>
                        <div className="info-main-left">
                            <div className="info-pokemon-title">
                                <h1 className="info-pokemon-name">{ucwords(allVarieties[indexCurrentVariety].name)} &#9654;</h1>
                                <h3 className="info-pokemon-genus">{species.genera.filter(generaObj => (generaObj.language.name == "en"))[0].genus}</h3>
                            </div>
                                
                            <h3 className="info-pokemon-habitat">{(allVarieties[indexCurrentVariety].order >= 0 ? "N°"+allVarieties[indexCurrentVariety].order.toString().padStart(4, "0") : "????") + " -- " + (species.habitat && "Can be found in : " + ucwords(species.habitat.name))}</h3>

                            <h4 className="info-pokemon-flavor">{species.flavor_text_entries.filter(entry => (entry.language.name == "en"))[0].flavor_text.replace("\n", " ").replace("\f", " ")}</h4>
                        
                            {/* <h1 style={{marginTop: "64px", textAlign: "center"}}>More info will be added later ...</h1> */}
                            {evolutionContainer}

                        </div>

                        <div className="info-sprite-card">
                            <div className="info-type-row">
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
                                    <div className={"info-gender-row"}>
                                        {currentSprites && Object.keys(currentSprites).map((currentGender,index) => (
                                            (currentSprites[currentGender]["default"].length != 0 || currentSprites[currentGender]["shiny"].length != 0) &&
                                            <button key={index} onClick={() => changeGender(currentGender)}>{ucwords(currentGender)}</button>
                                        ))}
                                    </div>
                                    <img className="info-pokemon-image" src={currentSprites[gender][rarity][indexCurrentSprite]} alt="pokemon" />
                                    <div className="info-sprite-controls">
                                        {(currentSprites[gender][rarity].length - 1) > 0 &&
                                            <button onClick={() => { setIndexCurrentSprite(Number(!indexCurrentSprite)) }}>&#9664;</button>
                                        }
                                        {currentSprites[gender]["shiny"].length != 0 &&
                                            <button onClick={() => { setRarity(rarity == "default" ? "shiny" : "default") }} className="rarity-button" style={{
                                                boxShadow: rarity === "shiny" ? "0 2px 0 #7d640e, 0 5px 5px rgba(0,0,0,0.2)" : "0 5px 0 #7d640e, 0 8px 5px rgba(0,0,0,0.2)",
                                                transform: rarity === "shiny" ? "translateY(3px)" : "translateY(0)"
                                            }}>Shiny</button>
                                        }
                                        {(currentSprites[gender][rarity].length - 1) > 0 &&
                                            <button onClick={() => { setIndexCurrentSprite(Number(!indexCurrentSprite)) }}>&#9654;</button>
                                        }
                                    </div>
                                </>
                            }

                                    <div className="info-stats">
                                {allVarieties[indexCurrentVariety].stats.map((currentStat, index) => (
                                    <>
                                        <div key={index*2} className="info-stat-item">{ucwords(currentStat.stat.name)} : {currentStat.base_stat}</div>
                                        <Bar key={index*2+1} value={currentStat.base_stat} maxValue={200} width={"200px"} height={"16px"} backgroundColor={"black"}/>
                                    </>
                                ))}
                            </div>
                            <div className="info-meta">
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
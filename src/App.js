import "./App.css";
import Description from "./components/Decription/description"; // Cài spellChecker để soát lỗi chính tả
import Item from "./components/Item/item";
import Search from "./components/Search/search";
import { createContext , useEffect, useState, useRef } from "react";

export const MyContext = createContext();

function App() {
    const urlPokemon = 'https://pokeapi.co/api/v2/pokemon/?limit=898';
    const urlType = 'https://pokeapi.co/api/v2/type';
    const [pokemonData, setPokemonData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [number , setNumber] = useState(null);
    const botRef = useRef(null);

    const fetchPokemonData = async () => {
        try {
            const res = await fetch(urlPokemon); // lấy hết 898 cái , lưu trong 1 cái mảng nhưng chỉ lấy ra 20 cái ( nhưng vẫn là render mà )
            const data = await res.json();
            return data.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const fetchPokemonTypes = async (pokemon) => {
        const pokemonWithType = [];

        for (let i = 1; i <= 18; i++) {
            const res = await fetch(`${urlType}/${i}`);
            const data = await res.json();
            const typeName = data.name;

            data.pokemon.forEach((p) => {
                const matchedPokemon = pokemon.find((pokemon) => pokemon.url === p.pokemon.url);
                if (matchedPokemon) {
                    const existingPokemon = pokemonWithType.find(p => p.name === matchedPokemon.name);
                    if (existingPokemon) {
                        existingPokemon.types.push(typeName);
                    } else {
                        pokemonWithType.push({
                            name: matchedPokemon.name,
                            url: matchedPokemon.url,
                            types: [typeName]
                        });
                    }
                }
            });
        }

        setPokemonData(pokemonWithType);
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const pokemon = await fetchPokemonData();
            await fetchPokemonTypes(pokemon);
            setIsLoading(false);
        };

        loadData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver( // chỉ lấy 20 cái 1 
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isLoading) {
                        console.log('oke');
                    }
                });
            },
            { threshold: 1.0 }
        );

        if (botRef.current) {
            observer.observe(botRef.current);
        }

        return () => {
            if (botRef.current) {
                observer.unobserve(botRef.current);
            }
        };
    }, [isLoading]);
    pokemonData.forEach((pokemon) => {
        const regex = /\/(\d+)\/$/;
        const match = pokemon.url.match(regex);
        if (match) {
            pokemon.order = parseInt(match[1]);
        }
    });
    pokemonData.sort((a, b) => a.order - b.order);
    
    return (
        <MyContext.Provider value={{ number, setNumber }} >
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <Search />
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row">
                <div className="col-8">
                    <div className="row">
                        {pokemonData.map((element ) => (
                            <div className="col-4" key={element.order}>
                                <Item 
                                    dataProps={element.name} 
                                    types={element.types} 
                                    id={element.order}
                                />
                            </div>
                        ))}
                        <div className="bot" ref={botRef}></div>
                    </div>
                </div>
                <div className="col-4">
                    <Description />
                </div>
            </div>
        </div>
        </MyContext.Provider>
    );
}

export default App;

import "./item.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../App"
import { typeColors } from "../../function/handleColor"
import { replaceSpace , TachSo } from "../../function/handleText"
// Item là dumb component hay smart component
function Item(props) {
    const knowColor = useRef(null);
    const { setId } = useContext(MyContext);
    const { datafetch } = props;
    const [pokemonTypes, setPokemonTypes] = useState([]);

    function showPokemonDetails() {
        const url = props.datafetch.url;
        const parts = url.split("/");
        const id = parts[parts.length - 2]; // Số trong đường dẫn API
        setId(id);
    }

    useEffect(() => {
        // fetch màu
        const fetchTypes = async () => {
            const res = await fetch(datafetch.url);
            const data1 = await res.json();
            setPokemonTypes(data1.types);
        };
        fetchTypes();
    }, [datafetch.url]);

    return (
        <div className="pokemon-card" onClick={showPokemonDetails}>
            <div className="pokemon-card__image">
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${TachSo(datafetch.url)}.png`}
                    alt={datafetch.name}
                />
            </div>
            <div className="pokemon-card__id">
                <span>N° {TachSo(datafetch.url)}</span>
            </div>
            <div className="pokemon-card__name" ref={knowColor}>
                <h3>{replaceSpace(datafetch.name)}</h3>
            </div>
            <div className="pokemon-card__types">
                {pokemonTypes.map((typeInfo, index) => (
                    <div
                        key={index}
                        className="pokemon-card__type"
                        style={{
                            backgroundColor: typeColors[typeInfo.type.name],
                        }}
                    >
                        {typeInfo.type.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Item;

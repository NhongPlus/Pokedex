import './item.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '../../App';

function Item(props) {
    const knowColor = useRef(null);
    const { setId } = useContext(MyContext);
    const { datafetch } = props;
    const [pokemonTypes, setPokemonTypes] = useState([]);

    function TachSo(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    const VietHoa = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    function Show() {
        const url = props.datafetch.url;
        const parts = url.split('/');
        const id = parts[parts.length - 2]; // số ở api 
        setId(id);
    }

    useEffect(() => { // fetch màu
        const fetchTypes = async () => {
            const res = await fetch(datafetch.url);
            const data1 = await res.json();
            setPokemonTypes(data1.types);
        };
        fetchTypes();
    }, [datafetch.url]);

    const typeColors = {
        'normal': '#BCBCAC',
        'fighting': '#BC5442',
        'flying': '#669AFF',
        'poison': '#AB549A',
        'ground': '#DEBC54',
        'rock': '#BCAC66',
        'bug': '#ABBC1C',
        'ghost': '#6666BC',
        'steel': '#ABACBC',
        'fire': '#FF421C',
        'water': '#2F9AFF',
        'grass': '#78CD54',
        'electric': '#FFCD30',
        'psychic': '#FF549A',
        'ice': '#78DEFF',
        'dragon': '#7866EF',
        'dark': '#785442',
        'fairy': '#FFACFF',
        'shadow': '#0E2E4C'
    };

    return (
        <div className="pokemon-card" onClick={Show}>
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
                <h3>{VietHoa(datafetch.name)}</h3>
            </div>
            <div className="pokemon-card__types">
                {pokemonTypes.map((typeInfo, index) => (
                    <div
                        key={index}
                        className="pokemon-card__type"
                        style={{ backgroundColor: typeColors[typeInfo.type.name] }}
                    >
                        {VietHoa(typeInfo.type.name)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Item;

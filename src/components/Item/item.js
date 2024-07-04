import React, { useContext } from 'react';
import './item.css'
function Item(props) {
    const { datafetch } = props;

    function extractId(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    return (
        <div className="pokemon-card">
            <div className="pokemon-card__image">
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractId(datafetch.url)}.png`}
                    alt={datafetch.name}
                />
            </div>
            <div className="pokemon-card__id">
                <span>N° {extractId(datafetch.url)}</span>
            </div>
            <div className="pokemon-card__name">
                <h3>{capitalizeFirstLetter(datafetch.name)}</h3>
            </div>
            <div className="pokemon-card__types">
                tinh sau
            </div>
        </div>
    );
}



export default Item;

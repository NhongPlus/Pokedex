import React, { useEffect, useState } from 'react';
import './description.css';
import { mapName, replaceSpace, Text } from "../../function/handleText"
import { typeColors, ListMau } from "../../function/handleColor"

function Description(props) {
    const { selectedNumber } = props;
    const [infor, setInfor] = useState(null);
    const [des, setDes] = useState(null);
    const [level, setLevel] = useState(null);
    const [evolution, setEvolution] = useState([]);

    const getUrlList = (chain) => {
        const speciesList = [];
        const traverseEvolutionChain = (chain) => {
            const species = chain.species.url;
            speciesList.push(species);
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(evolution => {
                    traverseEvolutionChain(evolution);
                });
            }
        };
        traverseEvolutionChain(chain);
        return speciesList;
    };
    const getLevelList = (chain) => {
        const levelList = [];
        const traverseEvolutionChain = (chain) => {
            if (chain.evolution_details && chain.evolution_details.length > 0) {
                chain.evolution_details.forEach(detail => {
                    if (detail.min_level === null) {
                        levelList.push('?');
                    }
                    else {
                        levelList.push(detail.min_level)
                    }
                });
            }
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(evolution => {
                    traverseEvolutionChain(evolution);
                });
            }
        };
        traverseEvolutionChain(chain);
        return levelList;
    };

    useEffect(() => {
        const fetchEvo = async (evoChainId) => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evoChainId}`);
                const jsonData = await response.json();
                setLevel(getLevelList(jsonData.chain));
                setEvolution(getUrlList(jsonData.chain));

            } catch (error) {
                console.error('Error fetching evolution data:', error);
            }
        };
        const fetchText = async () => {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedNumber}`);
                const json = await res.json();
                console.log(json);
                setDes(json);
                const evoChainUrl = json.evolution_chain.url;
                const evoChainId = evoChainUrl.split('/').filter(Boolean).pop();
                fetchEvo(evoChainId);
            } catch (error) {
                console.error('Error fetching species data:', error);
            }
        };

        if (selectedNumber) {
            fetchText();
        }
    }, [selectedNumber]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedNumber}`);
                const jsonData = await response.json();
                setInfor(jsonData);
            } catch (error) {
                console.error('Error fetching Pokemon data:', error);
            }
        };

        if (selectedNumber) {
            fetchData();
        }
    }, [selectedNumber]);

    async function handleLink(url) {
        try {
            const response = await fetch(url); // fecth 1 lần
            const data = await response.json();
            const finalLink = await fetch(data.varieties[0].pokemon.url); // lần 2 lấy ra https://pokeapi.co/api/v2/pokemon
            const susces = await finalLink.json();
            setInfor(susces);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        console.log(evolution);
    }
    const extractIdFromUrl = (url) => {
        const parts = url.split('/').filter(Boolean);
        return parts[parts.length - 1];
    };
    return (
        <div className="description">
            {infor ? (
                <>
                    <img
                        className="description__image"
                        src={infor.sprites.versions['generation-v']['black-white'].animated.front_default}
                        alt={infor.name}
                    />
                    <p className="description__id">N°{infor.id}</p>
                    <h2 className="description__name">{replaceSpace(infor.name)}</h2>
                    <div className="description__type-list">
                        {infor.types.map((typeInfo, index) => (
                            <div
                                key={index}
                                className={`description__type-item ${typeInfo.type.name}`}
                                style={{ backgroundColor: typeColors[typeInfo.type.name] }}
                            >
                                {replaceSpace(typeInfo.type.name)}
                            </div>
                        ))}
                    </div>
                    <div className='description__entry'>
                        <h4>Pokedex Entry</h4>
                        <div className='description__entry--text'>
                            {Text(des?.flavor_text_entries.find((item) => item.language.name === 'en')?.flavor_text)}
                        </div>
                    </div>
                    <div className='row center'>
                        <div className='description__bmi'>
                            <div className='description__bmi--height width-100 column center margin-5'>
                                <h4>Height</h4>
                                <div className='description__bmi--box'>{infor.height / 10}m</div>
                            </div>
                            <div className='description__bmi--weight width-100 column center margin-5'>
                                <h4>Weight</h4>
                                <div className='description__bmi--box'>{infor.weight / 10}kg</div>
                            </div>
                        </div>
                    </div>
                    <div className='row center'>
                        <h4>Abilities</h4>
                        <div className='description__abilities'>
                            <div className='description__abilities--box'>
                                {infor.abilities.slice(0, 2).map((item, index) => (
                                    <div key={index} className='description__abilities--box-igredient'>
                                        {replaceSpace(item.ability.name)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='row center'>
                        <h4>Stats</h4>
                        <div className='description__stats'>
                            {infor.stats.map((statItem, index) => (
                                <div key={index} className='description__stats__box'>
                                    <div style={{ backgroundColor: ListMau[statItem.stat.name] }} className='description__stats__box-name'>
                                        {mapName(statItem.stat.name)}
                                    </div>
                                    <div className='description__stats__box-index'>
                                        {statItem.base_stat}
                                    </div>
                                </div>
                            ))}
                            <div className='description__stats__total'>
                                <div className='description__stats__total-label'>TOT</div>
                                {infor.stats.reduce((total, statItem) => total + statItem.base_stat, 0)}
                            </div>
                        </div>
                    </div>
                    <h4>Evolution</h4>
                    <div className='row center'>
                        <div className='description__evolution'>
                            {evolution.slice(0, 3).map((speciesUrl, index) => {
                                const speciesId = extractIdFromUrl(speciesUrl);
                                return (
                                    <div key={index} className='description__evolution-item'>
                                        <img
                                            onClick={() => handleLink(speciesUrl)}
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`}
                                            className='description__evolution--image'
                                        />
                                        {index < level.length && (
                                            <div className='description__evolution--level'>
                                                {level[index] !== '?' ? `Lv. ${level[index]}` : '?'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <img className="description__image--no-pokemon" src='https://js-pokedex-virid.vercel.app/src/no-pokemon-selected-image.png' alt="No Pokemon selected" />
            )}
        </div>
    );
}

export default Description;

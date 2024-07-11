import React, { useContext, useEffect, useState } from 'react';
import './description.css';
import { MyContext } from '../../App';

function Description() {
    const ListMau = {
        'hp': '#DF2140',
        'attack': '#FF994D',
        'defense': '#EECD3D',
        'special-attack': '#85DDFF',
        'special-defense': '#96DA83',
        'speed': '#FB94A8'
    }

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
    const { id } = useContext(MyContext);
    const [infor, setInfor] = useState(null);
    const [des, setDes] = useState(null);  // Sửa lại kiểu dữ liệu từ số nguyên (0) sang null

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const lower = (string) => {
        return string.toLowerCase();
    }
    const Text = (text) => {
        return text.replace(/\u000c/g, ' ').replace(/move/g, 'move');
    };
    const mapName = (name) => {
        switch (name.toLowerCase()) {
            case 'attack':
                return 'ATK';
            case 'defense':
                return 'DEF';
            case 'special-attack':
                return 'SpA';
            case 'special-defense':
                return 'SpD';
            case 'speed':
                return 'SPD';
            default:
                return name
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // cái này là tổng quan con poke
                const jsonData = await response.json();
                console.log(jsonData.stats);
                console.log(jsonData.abilities);

                setInfor(jsonData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (id) { // nếu id có giá trị thì mới gọi 
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        const fetchText = async () => {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`); // cái này cụ thể hơn chỉ số bla bla
                const json = await res.json();
                setDes(json);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (id) { // nếu id có giá trị thì mới gọi 
            fetchText();
        }
    }, [id]);

    return (
        <div className="description">
            {infor ? (
                <>
                    <img
                        className="description__image"
                        src={infor.sprites.versions['generation-v']['black-white'].animated.front_default}
                        alt={infor.name}
                    />
                    <p className="description__number">N°{id}</p>
                    <h2 className="description__name">{capitalizeFirstLetter(infor.name)}</h2>
                    <div className="description__type-list">
                        {infor.types.map((typeInfo, index) => (
                            <div
                                key={index}
                                className={`description__type-item ${typeInfo.type.name}`}
                                style={{ backgroundColor: typeColors[typeInfo.type.name] }}
                            >
                                {capitalizeFirstLetter(typeInfo.type.name)}
                            </div>
                        ))}
                    </div>
                    <div className='description__entry'>
                        <h4>Pokedex Entry</h4>
                        <div className='description__entry--text'>
                            {des && des.flavor_text_entries[0] && Text(des.flavor_text_entries[0].flavor_text)}
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
                                {infor.abilities.map((item, index) => {
                                    return <div key={index}
                                    className='description__abilities--box-igredient'
                                    >
                                        {item.ability.name}
                                    </div>;
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='row center'>
                        <h4 className='row__title'>Stats</h4>
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
                    <div className='row center'>
                        <h4>Evolution</h4>
                    </div>
                </>
            ) : (
                <img className="description__image--no-pokemon" src='https://js-pokedex-virid.vercel.app/src/no-pokemon-selected-image.png' alt="No Pokemon selected" />
            )}
        </div>
    );
}

export default Description;

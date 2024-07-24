import "./App.css";
import Description from "./components/Description/description"; // Cài spellChecker để soát lỗi chính tả
import Item from "./components/Item/item";
import Search from "./components/Search/search";
import { useEffect, useState, useRef } from "react";
import { FaAngleUp } from "react-icons/fa6";

const ITEM_PER_PAGE = 20;

function App() {
    const urlPokemon = "https://pokeapi.co/api/v2/pokemon/?limit=898";
    const urlType = "https://pokeapi.co/api/v2/type";
    const [pokemonData, setPokemonData] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(0);
    const [savedPage, setSavedPage] = useState(0); // lưu trữ số trang đã render
    const [renderedData, setRenderedData] = useState([]);
    const [findPoke, setFindPoke] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const botRef = useRef(null);

    const fetchPokemonData = async () => {
        try {
            const res = await fetch(urlPokemon);
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
                const matchedPokemon = pokemon.find(
                    (pokemon) => pokemon.url === p.pokemon.url
                );
                if (matchedPokemon) {
                    const existingPokemon = pokemonWithType.find(
                        (p) => p.name === matchedPokemon.name
                    );
                    if (existingPokemon) {
                        existingPokemon.types.push(typeName);
                    } else {
                        pokemonWithType.push({
                            name: matchedPokemon.name,
                            url: matchedPokemon.url,
                            types: [typeName],
                        });
                    }
                }
            });
        }

        pokemonWithType.forEach((pokemon) => {
            const regex = /\/(\d+)\/$/;
            const match = pokemon.url.match(regex);
            if (match) {
                pokemon.order = parseInt(match[1]);
            }
        });
        pokemonWithType.sort((a, b) => a.order - b.order);

        setPokemonData(pokemonWithType);
        setRenderedData(pokemonWithType.slice(0, ITEM_PER_PAGE));
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
        if (findPoke === '') {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !isLoading) {
                            setCurrentPage((prevPage) => { // lưu cả 2 giá trị luôn 
                                const newPage = prevPage + 1;
                                setSavedPage(newPage);  // lưu vào setSavedPage 
                                return newPage; // lưu vào setCurrentPage luôn giá trị đó 
                            });
                            // let a = 0; tại vì mỗi khi mà lăn chuột xuống thì a lại khởi tạo = 0 => không đúng 
                            // setCurrentPage((prevPage) => prevPage + 1); // trả về prevPage + 1 
                            // setmemoryPage(++a); // luôn = 1

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
        }

    }, [isLoading, findPoke]);
    
    useEffect(() => {
        console.log(savedPage);
        console.log(currentPage);
    },[savedPage , currentPage])

    useEffect(() => {
        if (currentPage > 0 && findPoke === '') {
            const newArr = [...renderedData, ...pokemonData.slice(currentPage * ITEM_PER_PAGE, (currentPage + 1) * ITEM_PER_PAGE)];
            setRenderedData(newArr);
        }
    }, [currentPage, findPoke]);

    useEffect(() => {
        if (findPoke !== '') { // nêu mà cái thanh ipnut nó có chữ
            const filteredData = pokemonData.filter((item) =>
                item.name.toLowerCase().includes(findPoke.toLowerCase())
            );
            setRenderedData(filteredData); // thì renderData sẽ truyền vào 1 mảng có những tên trùng
        } else {
            setRenderedData(pokemonData.slice(0, ITEM_PER_PAGE * (savedPage + 1))); 
            // nếu mà thanh input rỗng thì cắt ròi +1 , vì ban đầu render ra 20 con nhưng page vẫn là 0
        }

    }, [findPoke, pokemonData]);

    function backToTop() {
        window.scrollTo(0, 0);
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <Search setFindPoke={setFindPoke} />
                    </div>
                    <div className="col-4"></div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <div className="row">
                            {renderedData?.map((element) => {
                                return element.name ? (
                                    <div className="col-4" key={element?.order}>
                                        <Item
                                            dataProps={element?.name}
                                            types={element?.types}
                                            id={element?.order}
                                            setSelectedNumber={setSelectedNumber}
                                        />
                                    </div>
                                ) : null;
                            })}
                            <div className="bot" ref={botRef}></div>
                        </div>
                    </div>
                    <div className="col-4">
                        <Description selectedNumber={selectedNumber} />
                    </div>
                </div>
            </div>
            <FaAngleUp className="abce" onClick={backToTop} />
        </>
    );
}

export default App;

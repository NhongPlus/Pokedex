import "./App.css";
import Description from "./components/Decription/description"; // Cài spellChecker để soát lỗi chính tả
import Item from "./components/Item/item";
import Search from "./components/Search/search";
import { createContext, useEffect, useState, useRef } from "react";

export const MyContext = createContext(); // Context ở đây để làm j thế?

function App() {
    const [data, setData] = useState([]);
    const [nextUrl, setNextUrl] = useState("https://pokeapi.co/api/v2/pokemon");
    const [id, setId] = useState(null);
    const botRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (url) => {
        try {
            setIsLoading(true);
            const response = await fetch(url);
            const jsonData = await response.json();
            setData((prevData) => [...prevData, ...jsonData.results]);
            setNextUrl(jsonData.next);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(nextUrl);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && nextUrl && !isLoading) {
                        fetchData(nextUrl);
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
    }, [nextUrl, isLoading]);

    return (
        <MyContext.Provider value={{ id, setId }}>
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
                            {data.map((pokemon, index) => (
                                <div key={index} className="col-4">
                                    <Item datafetch={pokemon} />
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

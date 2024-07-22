// search.jsx
import "./search.css";
import { useRef, useState } from "react"; 
import { FaMagnifyingGlass } from "react-icons/fa6";
import Item from "../Item/item";

function Search() {
    const text = useRef('');
    const [searchResults, setSearchResults] = useState([]); 

    const takeCha = () => {
        // const inputValue = text.current.value.toLowerCase(); 
        // const locData = data.filter(element => element.name.toLowerCase().includes(inputValue)); 
        // locData.forEach(element => {
        //     console.log(element.name);
        // });
        // setSearchResults(locData); 
    };

    return (
        <>
            <div className="container__search">
                <input type="text" className="container__search--input" placeholder="Search your Pokemon" ref={text} onKeyUp={takeCha} />
                <div className="container__search--find">
                    <FaMagnifyingGlass />
                </div>
            </div>
            {/* Hiển thị kết quả tìm kiếm */}
            <div className="search-results col-4" >
                {searchResults.map((pokemon, index) => (
                    <Item key={index} datafetch={pokemon} />
                ))}
            </div>
        </>
    );
}

export default Search;

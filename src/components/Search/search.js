// search.jsx
import "./search.css";
import { useRef } from "react"; 
import { FaMagnifyingGlass } from "react-icons/fa6";

function Search(props) {
    const {setFindPoke} = props;
    const text = useRef('');

    const findPokemon = () => {
        setFindPoke(text.current.value)
    };

    return (
        <>
            <div className="container__search">
                <input type="text" className="container__search--input" placeholder="Search your Pokemon" ref={text} onChange={findPokemon} />
                <div className="container__search--find">
                    <FaMagnifyingGlass />
                </div>
            </div>
        </>
    );
}

export default Search;

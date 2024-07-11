import "./search.css";
import { useRef } from "react"; 
import { FaMagnifyingGlass } from "react-icons/fa6";
function Search() {
    const value = useRef('');
    function takeCha(){
        console.log(value.current.value);
    }
    return (
    <>
        <div className="container__search ">
            <input type="text" className="container__search--input" placeholder="Search your Pokemon" ref={value} onKeyUp={takeCha}/>
            <div className="container__search--find">
                <FaMagnifyingGlass />
            </div>
        </div>
    </>);
}

export default Search;
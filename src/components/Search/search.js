import "./search.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MyContext, } from "../../App";
import { useContext } from "react";
function Search() {
    const dulieu = useContext(MyContext);
    console.log(dulieu);
    return (
    <>
        <div className="container__search ">
            <input type="text" className="container__search--input" placeholder="Search your Pokemon" />
            <div className="container__search--find">
                <FaMagnifyingGlass />
            </div>
        </div>
    </>);
}

export default Search;
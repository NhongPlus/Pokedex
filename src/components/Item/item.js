import "./item.css";
import { replaceSpace} from "../../function/handleText";
import { typeColors } from "../../function/handleColor";
function Item(props) {
    const { dataProps, types, id , setSelectedNumber } = props;

    function handleClick() {
        setSelectedNumber(id);
    }
    return (
        <div className="pokemon-card" onClick={handleClick}>
            <div className="pokemon-card__image">
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={dataProps}
                />
            </div>
            <div className="pokemon-card__id">
                <span>N° {id}</span>
            </div>
            <div className="pokemon-card__name">
                <h3>{replaceSpace(dataProps)}</h3>
            </div>
            <div className="pokemon-card__types">
                {types &&
                    types.map((type, typeIndex) => (
                        <span
                            key={typeIndex}
                            className="pokemon-card__type"
                            style={{
                                backgroundColor: typeColors[type.toLowerCase()],
                            }}
                        >
                            {type}
                        </span>
                    ))}
            </div>
        </div>
    );
}

export default Item;

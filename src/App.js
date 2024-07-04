import './App.css';
import Description from './components/Decription/decription';
import Item from './components/Item/item';
import Search from './components/Search/search';
import { createContext  , useEffect, useState } from 'react';
export const MyContext = createContext();
function App() {
  
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/');
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, []);
  return (
    <MyContext.Provider value={data}>
      <div className="container">
      <div className="row">  {/*  tìm kiếm */}
        <div className="col-8">
          <Search />
        </div>
        <div className='col-4'></div>
      </div>
      <div className="row"> {/*  box và đặc tả */}
        <div className="col-8">
          <div className='row'>
            {data && data.results.map((pokemon, index) => (
              <div key={index} className='col-4'>
                <Item datafetch={pokemon} />
              </div>
            ))}
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

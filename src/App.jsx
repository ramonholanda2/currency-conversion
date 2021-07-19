import { coinList } from "./api/index";
import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "./components/FormContainer";

import "./styles/app.scss";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [toggleBackground, setToggleBackground] = useState(0);

  async function getCoinList() {
    const localStorageCoins = localStorage.getItem('localStorageCoins');
    
    
    if(!localStorageCoins) {
      const { data } = await axios.get(coinList);
      localStorage.setItem("localStorageCoins", JSON.stringify(data.results))
      setCoins(data.results);
    } else {
      setCoins(JSON.parse(localStorageCoins))
    }
  }

  useEffect(() => {
    getCoinList();
  }, []);

  return (
    <div className={`app background${toggleBackground <= 5 ? toggleBackground : '5'}` }>
      <FormContainer coins={coins} setToggleBackground={setToggleBackground} />
    </div>
  );
};

export default App;

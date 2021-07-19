import axios from "axios";
import { url, apiKey } from "../api";
import { useEffect, useState } from "react";

import "../styles/form-container.scss";

const FormContainer = ({ coins, setToggleBackground }) => {
  const [amount, setAmount] = useState(0);
  const [initialCountry, setInitialCountry] = useState("BRL");
  const [finalCountry, setFinalCountry] = useState("USD");
  const [multiplerMoney, setMultiplerMoney] = useState(0);
  const [resultConversion, setResultConversion] = useState(0);

  function toggleCoins() {
    setInitialCountry(finalCountry);
    setFinalCountry(initialCountry);
  }

  useEffect(() => {
    const query = `${initialCountry}_${finalCountry}`;

    if(!localStorage.getItem(`${query}`)) {
      axios
        .get(`${url}/api/v7/convert?q=${query}&compact=ultra&apiKey=${apiKey}`)
        .then((response) => {
          const multipler = response.data[query];
          setMultiplerMoney(multipler);
          localStorage.setItem(`${query}`, multipler)
        })
        .catch((error) => {
          console.error("erro ao na requisição do multiplicador", error);
        });
    } else {
      const multipler = localStorage.getItem(`${query}`);
      setMultiplerMoney(multipler);
    }


  }, [initialCountry, finalCountry]);

  useEffect(() => {
    const result = amount * multiplerMoney;

    setResultConversion(result);

    setToggleBackground(`${amount}`.length);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, initialCountry, finalCountry, multiplerMoney]);

  return (
    <>
      <div className="form-container">
        <div className={`countries ${`${amount}`.length >= 3 && 'white-color'}`}>
          <h3>{coins[initialCountry]?.currencyName}</h3>
        </div>
        <div className="coins">
          <form>
            <select
              onChange={(e) => setInitialCountry(e.target.value)}
              name="countries"
            >
              <option value={initialCountry}>
                {coins[initialCountry]?.id}
              </option>
              {coins &&
                Object.keys(coins).map((coin, index) => (
                  <option key={index} value={coins[coin].id}>
                    {coins[coin].id}
                  </option>
                ))}
            </select>
            <input onChange={(e) => setAmount(e.target.value)} type="number" />

          </form>
        </div>
      </div>

      <button onClick={toggleCoins} className="toggleBtnCoins">
        Trocar
      </button>

      <div className="form-container bottom">
        <div className={`countries ${`${amount}`.length >= 3 && 'white-color'}`}>
          <h3>{coins[finalCountry]?.currencyName}</h3>
        </div>
        <div className="coins">
          <form>
            <select
              onChange={(e) => setFinalCountry(e.target.value)}
              name="countries"
            >
              <option value={finalCountry}>{coins[finalCountry]?.id}</option>
              {coins &&
                Object.keys(coins).map((coin, index) => (
                  <option key={index} value={coins[coin].id}>
                    {coins[coin].id}
                  </option>
                ))}
            </select>
            <input
              value={`${resultConversion.toLocaleString('pt-br', {minimumFractionDigits: 2})} ${coins[finalCountry]?.currencySymbol ? coins[finalCountry]?.currencySymbol : '$'}`}
              disabled
              style={{ backgroundColor: "whitesmoke" }}
              type="text"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default FormContainer;

import React, { useEffect, useState } from 'react';
import './App.scss';

function App() {
  const averageSalaries = {
    tr: {
      value: 5092.19,
      currency: "TRY",
      oreSett: 50,
    },
    it: {
      value: 1494.86,
      currency: "EUR",
      oreSett: 40,
    }, 
  };

  const [ eurToTry, setEurToTry ] = useState(15.2);
  const [ from, setFrom ] = useState('TL');
  const [ inputValue, setInputValue ] = useState('');

  useEffect(()=>{
    // fetch("http://api.exchangeratesapi.io/v1/latest?access_key=70eb484299c2e73a5db14958e7d7d4e0&symbols=TRY")
    //   .then((response) => response.json())
    //   .then((json) => {
    //     setEurToTry(json.rates.TRY)
    //   });
      fetch("https://freecurrencyapi.net/api/v2/latest?apikey=9bf9d360-7f99-11ec-8def-c9b4c6c8dd33&base_currency=EUR")
      .then((response) => response.json())
      .then((json) => {
        setEurToTry(json.data.TRY);
      });
    
  },[inputValue])

  const getFeelsLikeValue = (value) => {
    if(!isNaN(value)){
      const avTurcoEur = averageSalaries.tr.value / eurToTry;
      const avTurcoOra = avTurcoEur / (50 * 4);
      const avItaloOra = averageSalaries.it.value / (40 * 4);
      const valueEur = value / eurToTry;
      const resultFromTL = (avItaloOra * valueEur / avTurcoOra);
      const resultFromEUR = (avItaloOra * value / avTurcoOra)*eurToTry;
      const result = from === "TL"? resultFromTL : resultFromEUR;
      return Math.round(result*100)/100;
    }else{return ''}
  }

  return (
    <div className="app">
      <h1>Feeling like a Turk 🥺</h1>
      {eurToTry != 1 &&
        <div className="live-change"><strong>Live EUR-TL</strong><br/>1 EUR = {eurToTry} TL</div>
      }
      <label>
        <input type="number" value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}}></input>
        <select className="origin" value={from} onChange={(e)=>{
          setFrom(e.target.value)
        }}>
          <option value="TL">TL</option>
          <option value="EUR">EUR</option>
        </select>
      </label>
      <span>feels for {from == "TL"? "a Turk" : "an Italian"} like</span>
      <span><strong>{getFeelsLikeValue(inputValue)}</strong> {from == "TL"? "EUR" : "TL"}
        {from == "EUR" &&
          <span> (<strong>{Math.round(getFeelsLikeValue(inputValue)/eurToTry*100)/100}</strong> EUR)</span>
        }
      </span>
      <span>are felt by {from == "TL"? "an Italian" : "a Turk"}.</span>
    </div>
  );
}

export default App;

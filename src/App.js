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

  const [ eurToTry, setEurToTry ] = useState(1);
  const [ inputValue, setInputValue ] = useState('');

  useEffect(()=>{
    fetch("http://api.exchangeratesapi.io/v1/latest?access_key=70eb484299c2e73a5db14958e7d7d4e0&symbols=TRY")
      .then((response) => response.json())
      .then((json) => {
        setEurToTry(json.rates.TRY)
      });
  },[])

  const getFeelsLikeValue = (value) => {
    if(!isNaN(value)){
      const avTurcoEur = averageSalaries.tr.value / eurToTry;
      const avTurcoOra = avTurcoEur / (50 * 4);
      const avItaloOra = averageSalaries.it.value / (40 * 4);
      const valueEur = value / eurToTry;
      const result = (avItaloOra * valueEur / avTurcoOra);
      return Math.round(result*100)/100;
    }else{return ''}
  }

  return (
    <div className="app">
      <h1>Feeling like a Turk 🥺</h1>
      <label><input type="number" value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}}></input> TL</label>
      <span>feels for a Turk like</span>
      <span><strong>{getFeelsLikeValue(inputValue)}</strong> EUR</span>
    </div>
  );
}

export default App;

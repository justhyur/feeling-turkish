import React, { useEffect, useState } from 'react';
import './App.scss';
import LoaderImg from './img/loader.gif'
import FlagImg from './img/tflag.png'

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

  const [ eurToTry, setEurToTry ] = useState(null);
  const [ from, setFrom ] = useState('TL');
  const [ inputValue, setInputValue ] = useState('');

  const [ convertValue, setConvertValue ] = useState('');

  useEffect(()=>{
    loadConversionData();
  },[]);

  useEffect(()=>{
    if(inputValue.toString().length > 0){
      setConvertValue(from === "TL"? inputValue/eurToTry : inputValue*eurToTry);
    }else{
      setConvertValue('');
    }
  },[inputValue]);

  const loadConversionData = () => {
    setEurToTry(null);
    fetch("https://freecurrencyapi.net/api/v2/latest?apikey=9bf9d360-7f99-11ec-8def-c9b4c6c8dd33&base_currency=EUR")
      .then((response) => response.json())
      .then((json) => {
        setEurToTry(json.data.TRY);
      });
  }

  const getFeelsLikeValue = (value) => {
    if(!isNaN(value)){
      const avTurcoEur = averageSalaries.tr.value / eurToTry;
      const avTurcoOra = avTurcoEur / (50 * 4);
      const avItaloOra = averageSalaries.it.value / (40 * 4);
      const valueEur = value / eurToTry;
      const resultFromTL = (avItaloOra * valueEur / avTurcoOra);
      const resultFromEUR = (avItaloOra * value / avTurcoOra)*eurToTry;
      return from === "TL"? resultFromTL : resultFromEUR;
    }else{return ''}
  }

  const approx = (num) => {
    return Math.round(num*100)/100;
  }

  return (
    <div className="app">
      {!eurToTry && 
        <div className="loading">
          <img src={LoaderImg} alt="load image"></img>
        </div>
      }
      {eurToTry && <>
        <img className="flag" src={FlagImg} alt="flag" onClick={loadConversionData}></img>
        <h1>Feeling Turk</h1>
        <div className="live-change"><strong>Live EUR-TL</strong><br/>1 EUR = {eurToTry} TL</div>
        <label>
          <input type="number" value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}}></input>
          <select className="origin" value={from} onChange={(e)=>{
            setFrom(e.target.value)
          }}>
            <option value="TL">TL</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        {inputValue.toString().length > 0 && <>
          <span className="margin-top">are actually</span>
          <span><strong>{from == "TL"? `${Math.round(convertValue*100)/100}` : `${Math.round(convertValue*100)/100}`}</strong> {from == "TL"? "EUR" : "TL"}</span>
          <span className="but">BUT</span>
          <span>it feels for {from == "TL"? "a Turk" : "an Italian"} like</span>
          <span><strong>{approx(getFeelsLikeValue(inputValue))}</strong> {from == "TL"? "EUR" : "TL"}
            {from == "EUR" &&
              <span> (<strong>{approx(getFeelsLikeValue(inputValue)/eurToTry)}</strong> EUR)</span>
            }
            {from == "TL" &&
              <span> (<strong>{approx(getFeelsLikeValue(inputValue)*eurToTry)}</strong> TL)</span>
            }
          </span>
          <span>are felt by {from == "TL"? "an Italian" : "a Turk"}.</span>
          <span className="margin-top">Life in Turkey is</span>
          <span>{approx(getFeelsLikeValue(inputValue)/convertValue)} <i>times</i></span>
          <span>cheaper than Italy.</span>
        </>}
      </>
      }
    </div>
  );
}

export default App;

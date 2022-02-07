import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import LoaderImg from './img/loader.gif'
import FlagImg from './img/tflag.png'

function App() {
  const averageSalaries = {
    tr: {
      value: 4956.86,
      currency: "TRY",
      oreSett: 48.4,
    },
    it: {
      value: 1446.61,
      currency: "EUR",
      oreSett: 39.5,
    }, 
  };

  const getStorageEURTRY = () => {
    return JSON.parse(localStorage.getItem("eurtry"));
  }
  const setStorageEURTRY = (val) => {
    const eurtry = {val, date:Date.now()}
    localStorage.setItem("eurtry", JSON.stringify(eurtry));
    setEurToTry(eurtry);
  }

  const [ eurToTry, setEurToTry ] = useState(getStorageEURTRY());
  const [ from, setFrom ] = useState('TL');
  const [ inputValue, setInputValue ] = useState('');

  const [ isOnline, setIsOnline ] = useState(window.navigator.onLine);

  const [ convertValue, setConvertValue ] = useState('');

  const mainInput = useRef(null);

  useEffect(()=>{
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    loadConversionData();
    console.log(window.navigator.onLine);
  },[]);

  useEffect(()=>{
    if(inputValue.toString().length > 0){
      setConvertValue(from === "TL"? inputValue/eurToTry.val : inputValue*eurToTry.val);
    }else{
      setConvertValue('');
    }
  },[inputValue, from]);

  const fetchEurToTry = () => {
    if(isOnline){
      fetch("https://freecurrencyapi.net/api/v2/latest?apikey=9bf9d360-7f99-11ec-8def-c9b4c6c8dd33&base_currency=EUR")
        .then((response) => response.json()).catch(err => {console.error(err); setEurToTry(getStorageEURTRY());})
        .then((json) => {
          if(json){
            setStorageEURTRY(json.data.TRY);
          }
        });
    } else{
      setEurToTry(getStorageEURTRY());
    }
  }

  const loadConversionData = () => {
    setEurToTry(null);
    const eurtry = getStorageEURTRY();
    if(eurtry){
      const now = Date.now();
      const timePassedSinceLastFetch = (now - eurtry.date) / 1000;
      if(timePassedSinceLastFetch < 60){
        setTimeout(()=>{
          console.log(`Time passed since last fetch is less than a minute. (${Math.floor(timePassedSinceLastFetch)} seconds)`);
          setEurToTry(eurtry);
        },250)
        return;
      } else{ 
        setTimeout(()=>{
          fetchEurToTry(); 
        },250);
      }
    } else{ 
      setTimeout(()=>{
        fetchEurToTry(); 
      },250);
    }
  }

  const getFeelsLikeValue = (value) => {
    if(!isNaN(value)){
      const avTurcoEur = averageSalaries.tr.value / eurToTry.val;
      const avTurcoOra = avTurcoEur / (50 * 4);
      const avItaloOra = averageSalaries.it.value / (40 * 4);
      const valueEur = value / eurToTry.val;
      const resultFromTL = (avItaloOra * valueEur / avTurcoOra);
      const resultFromEUR = (avItaloOra * value / avTurcoOra)*eurToTry.val;
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
      {eurToTry && 
        <main>
          <img className={`flag ${isOnline? "''" : "offline"}`} src={FlagImg} alt="flag" 
            onClick={()=>{if(isOnline)loadConversionData()}}
          ></img>
          <h1>Feeling Turk</h1>
          <div className="live-change"><strong>Live EUR-TL</strong><br/>1 EUR = {eurToTry.val} TL</div>
          <label>
            <input ref={mainInput} type="number" value={inputValue} inputMode="decimal" 
              onChange={(e)=>{setInputValue(e.target.value)}}
              onKeyUp={(e)=>{if(e.key === "Enter"){mainInput.current.blur()}}}
              ></input>
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
                <span> (<strong>{approx(getFeelsLikeValue(inputValue)/eurToTry.val)}</strong> EUR)</span>
              }
              {from == "TL" &&
                <span> (<strong>{approx(getFeelsLikeValue(inputValue)*eurToTry.val)}</strong> TL)</span>
              }
            </span>
            <span>are felt by {from == "TL"? "an Italian" : "a Turk"}.</span>
            <span className="margin-top">Life in Turkey is</span>
            <span>{approx(getFeelsLikeValue(inputValue)/convertValue)} <i>times</i></span>
            <span>cheaper than Italy.</span>
          </>}
        </main>
      }
    </div>
  );
}

export default App;

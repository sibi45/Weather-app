import { useEffect, useState } from 'react'
import './App.css'
import propTypes from "prop-types";
/* Image*/

import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import dizzleIcon from "./assets/dizzle.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";
import searchIcon from "./assets/search.png";
import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.png";
import PropTypes from 'prop-types';


const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="image" />
      </div>
      <div className='temp'>{temp}°∁</div>
      <div className='location'> {city}</div>
      <div className='country'> {country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity}</div>
            <div className="text">Humidity</div>

          </div>

        </div>



        <div className='element'>
          <img src={windIcon} alt="wind" className='icon' />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">wind speed</div>

          </div>

        </div>
      </div>

    </>
  );

};

WeatherDetails.propTyps = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  

}
function App() {

  let api_key = "314f54d06786f465599a4a10441bf591";
  const [text, setText] = useState("Chennai")
  const [icon, setIcon] = useState(dizzleIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setlat] = useState(0)
  const [log, setlog] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": dizzleIcon,
    "03n": dizzleIcon,
    "04d": dizzleIcon,
    "04n": dizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,

  }


  const search = async () => {


    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json()
      // console.log(data);
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setlat(data.coord.lat);
      setlog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);

    } catch (error) {
      console.log("An error occurred:", error.message);
      setError("An error occured while fetching weather data.");

    } finally {
      setLoading(false);
      //setError(true);
    }

  };

  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      search();
    }
  };

  useEffect(function(){
    search();
  },[]);
  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='search city' onChange={handleCity} value={text}
            onKeyDown={handleKeyDown} />
          <div className='search-icon' onClick={() => search()}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
       
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
       {cityNotFound && <div className="city-not-found">City not found</div>}
       {!loading && !cityNotFound &&<WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}
      </div>

    </>
  );
}

export default App;

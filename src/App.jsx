import { useEffect, useState } from "react";
import "./App.css";
import PropTypes from "prop-types";

//Images
import searchIcon from "./assets/search.png";
import cloudIcon from "./assets/cloud.png";
import drizzlingIcon from "./assets/drizzlingCloud.png";
import snowIcon from "./assets/snow.png";
import thunderIcon from "./assets/thunder.png";
import rainIcon from "./assets/rain.png";
import waveSpeedIcon from "./assets/waveSpeed.png";
import humidityIcon from "./assets/humidity.png";
import clearSunIcon from "./assets/clearSun.png";
import sunIcon from "./assets/sun.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wave,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="log">lattitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longtitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data_container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity_percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={waveSpeedIcon} alt="waveSpeed" className="icon" />
          <div className="data">
            <div className="waveSpeed_percentage">{wave} km/hr</div>
            <div className="text">Wave Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};
WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wave: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
};
function App() {
  let api_key = "18342f0107fe299303298f576daec04d";
  const [text, setText] = useState("Mumbai");

  const [icon, setIcon] = useState(clearSunIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLag] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wave, setWave] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzlingIcon,
    "03n": drizzlingIcon,
    "04n": drizzlingIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11n": thunderIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      //console.log(data);
      if (data.cod === "404") {
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWave(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLog(data.coord.lon);
      setLag(data.coord.lat);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearSunIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An Error Occured :", error.message);
      setError("An error occured while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  const handleCity = (e) => {
    setText(e.target.value);
  };
  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}
        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wave={wave}
          />
        )}
        <p className="copyright">
          Designed by <span>Punitha Thirupathi</span>
        </p>
      </div>
    </>
  );
}

export default App;

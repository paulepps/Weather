import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import TodayComponent from './components/TodayComponent/TodayComponent';
import ListComponent from './components/ListComponent/ListComponent';
import GraphComponent from './components/GraphComponent/GraphComponent';
import axios from 'axios';

import './App.css';

const App = () => {

    const [unit, setUnit] = useState('F');
    const [queryString, setQueryString] = useState('');
    const [latLng, setLatLng] = useState([]);
    const [navbarData, setNavbarData] = useState({});
    const [todayComponentData, setTodayComponentData] = useState({});
    const [listComponentData, setListComponentData] = useState([]);
    const [graphComponentData, setGraphComponentData] = useState([]);

    useEffect(() => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                setLatLng([position.coords.latitude, position.coords.longitude]);
            }, () => {
                console.log('Permission Denied');
            });
        } else {
            console.log('GeoLocation not supported...Update the browser fella');
        }
    }, []);

    const onUnitChange = (newUnit) => {
        setUnit(newUnit);
    }

    const onSearchSubmit = (query) => {
        setQueryString(query);
        setLatLng([]);
    }

    useEffect(() => {
        const hasLatLng = latLng.length > 0;
        const hasCityOrZipcode = (queryString !== '');

        if (hasLatLng || hasCityOrZipcode) {
            fetchWeatherForecast(hasLatLng).then(forecastData => {
                console.log('Forecast Data:', forecastData);
                // Extract component specific data...
                const navbarData = extractDataForNavbar(forecastData);
                const todayComponentData = extractDataForTodayComponent(forecastData);
                const { listComponentData, graphComponentData } = extractDataForListAndGraphComponent(forecastData);

                setNavbarData(navbarData);
                setTodayComponentData(todayComponentData);
                setListComponentData(listComponentData);
                setGraphComponentData(graphComponentData);

            }).catch(error => {
                console.log('Error:', error);
            });
        }
    }, [latLng.length, queryString, unit]
    )

    const fetchWeatherForecast = async (hasLatLng) => {
        const queryParams = (hasLatLng) ? `lat=${latLng[0]}&lon=${latLng[1]}` : `q=${queryString},us`;
        const unitType = (unit === 'C') ? 'metric' : 'imperial';
        const url = `${process.env.REACT_APP_BASE_URL}?${queryParams}&units=${unitType}&cnt=7&appid=${process.env.REACT_APP_API_KEY}`;

        const result = await axios.get(url);

        return result.data;
    }

    const extractDataForNavbar = (forecastData) => {
        return {
            city: `${forecastData.city.name}, ${forecastData.city.country}`
        };
    }

    const extractDataForTodayComponent = (forecastData) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const todayForecast = forecastData.list[0];

        const time = new Date(todayForecast.dt * 1000);
        const day = getDay(time);
        const date = `${monthNames[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`

        const weatherId = todayForecast.weather[0].id;
        const description = todayForecast.weather[0].description;

        const hours = new Date().getHours();
        const isDayTime = hours > 6 && hours < 20;
        let mainTemperature = (isDayTime) ? todayForecast.temp.day : todayForecast.temp.night;
        mainTemperature = Math.round(mainTemperature);
        const minTemperature = Math.round(todayForecast.temp.min);
        const maxTemperature = Math.round(todayForecast.temp.max);

        const pressure = todayForecast.pressure;
        const humidity = todayForecast.humidity;
        const windSpeed = todayForecast.speed;

        return {
            day,
            date,
            weatherId,
            description,
            mainTemperature,
            minTemperature,
            maxTemperature,
            pressure,
            humidity,
            windSpeed
        }
    }

    const extractDataForListAndGraphComponent = (forecastData) => {
        const listComponentData = [];
        const graphComponentData = [];

        forecastData.list.forEach(forecast => {
            let item = {};
            item.day = getDay(forecast.dt * 1000);
            item.weatherId = forecast.weather[0].id;
            item.description = forecast.weather[0].description;
            item.mainTemperature = Math.round(forecast.temp.day);

            listComponentData.push(item);
            graphComponentData.push(forecast.temp.day)
        });

        // Remove first element as that represents today's weather
        listComponentData.shift();

        return {
            listComponentData,
            graphComponentData
        }
    }

    // Takes date object or unix timestamp in ms and returns day string
    const getDay = (time) => {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday ", "Friday", "Saturday"];
        return dayNames[(new Date(time).getDay())];
    }

    const hasLatLng = latLng.length > 0;
    const hasCityOrZipcode = (queryString !== '');
    const shouldRenderApp = hasLatLng || hasCityOrZipcode;

    const instructionLayout = <div className="app-instruction">
        <p>Allow Location Access or type city name/zip code in search area to get started.</p>
    </div>

    const mainAppLayout = <>
        <div className="app-today">
            <TodayComponent data={todayComponentData} unit={unit} />
        </div>
        <div className="app-list-graph">
            <ListComponent data={listComponentData} />
            <GraphComponent data={graphComponentData} />
        </div>
    </>

    return (
        <div className="app-container">
            <div className="app-nav">
                <Navbar
                    searchSubmit={onSearchSubmit}
                    changeUnit={onUnitChange}
                    unit={unit}
                    data={navbarData}
                />
            </div>
            {shouldRenderApp ? mainAppLayout : instructionLayout}
        </div>
    );
}


export default App;
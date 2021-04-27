const weatherAPIKey = '4cfac69bf0d24aaac253da6ec1fa0c54';

let search = document.querySelector('.weather__search');

const city = document.querySelector('.weather__city');
const day = document.querySelector('.weather__day');
const humidity = document.querySelector('.weather__indicator--humidity>.value');
const wind = document.querySelector('.weather__indicator--wind>.value');
const pressure = document.querySelector('.weather__indicator--pressure>.value');
const image = document.querySelector('.weather__image');
const temperature = document.querySelector('.weather__temperature>.value');

let weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;

const getWeatherByCityName = async (city) =>{
    let endpoint = weatherBaseEndPoint + '&q=' + city;
    let response = await fetch(endpoint);
    let weather = await response.json();
    return weather;
}

search.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13){
        let weather = await getWeatherByCityName(search.value);
        updateCurrentWeather(weather);
    }
})

const updateCurrentWeather = (data) => {
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;

    let windDirection = '';
    let deg = data.wind.deg;

    if(deg > 45 && deg <= 135){
        windDirection = 'East'
    }else if(deg > 135 && deg <= 225){
        windDirection = 'South'
    }else if(deg > 225 && deg <= 315){
        windDirection = 'West'
    }else{
        windDirection = 'North'
    }

    wind.textContent = windDirection + ', ' + data.wind.speed;

    temperature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp) : Math.round(data.main.temp);
}

const dayOfWeek = () => {
    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'});
}


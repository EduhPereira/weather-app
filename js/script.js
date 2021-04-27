const weatherAPIKey = '4cfac69bf0d24aaac253da6ec1fa0c54';

let search = document.querySelector('.weather__search');

const city = document.querySelector('.weather__city');
const day = document.querySelector('.weather__day');
const humidity = document.querySelector('.weather__indicator--humidity>.value');
const wind = document.querySelector('.weather__indicator--wind>.value');
const pressure = document.querySelector('.weather__indicator--pressure>.value');
const image = document.querySelector('.weather__image');
const temperature = document.querySelector('.weather__temperature>.value');
const suggestions = document.querySelector('#suggestions');

let weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;
let cityBaseEndPoint = 'https://api.teleport.org/api/cities/?search=';

const weatherImages = [
    {
        url: 'assets/images/clear-sky.png',
        ids: [800]
    },

    {
        url: 'assets/images/broken-clouds.png',
        ids: [803, 804]
    },

    {
        url: 'assets/images/few-clouds.png',
        ids: [801]
    },

    {
        url: 'assets/images/mist.png',
        ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781]
    },
    
    {
        url: 'assets/images/rain.png',
        ids: [500, 501, 502, 503, 504]
    },

    {
        url: 'assets/images/scattered-clouds.png',
        ids: [802]
    },

    {
        url: 'assets/images/shower-rain.png',
        ids: [300, 301, 302, 310, 311, 312, 313, 314, 321, 520, 521, 522, 531]
    },

    {
        url: 'assets/images/snow.png',
        ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },

    {
        url: 'assets/images/thunderstorm.png',
        ids: [200, 201, 202, 210, 211, 212, 220, 221, 230, 231, 232]
    }
]

const getWeatherByCityName = async (cityString) =>{
    let city;

    if(cityString.includes(',')){
        city = cityString.substring(0, cityString.indexOf(',')) + cityString.substring(cityString.lastIndexOf(','));
    }else{
        city = cityString;
    }

    let endpoint = weatherBaseEndPoint + '&q=' + city;
    let response = await fetch(endpoint);

    if(response.status !== 200){
        alert('City not Found!');
        return;
    }

    let weather = await response.json();
    return weather;
}

search.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13){
        let weather = await getWeatherByCityName(search.value);
        if(!weather){
            return;
        }
        updateCurrentWeather(weather);
    }
})

search.addEventListener('input', async () => {
    let endpoint = cityBaseEndPoint + search.value;
    let result = await (await fetch(endpoint)).json();
    suggestions.innerHTML = '';
    let citties = result._embedded['city:search-results'];
    let length = citties.length > 5 ? 5 : citties.length;
    for(let i = 0; i < length; i++){
        let option = document.createElement('option');
        option.value = citties[i].matching_full_name;
        suggestions.appendChild(option);
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

    let imgID = data.weather[0].id;

    weatherImages.forEach(obj => {
        if(obj.ids.includes(imgID)){
            image.src = obj.url;
        }
    });
}

const dayOfWeek = () => {
    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'});
}
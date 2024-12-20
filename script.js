const cityInput = document.querySelector('.city-search');
const searchBtn = document.querySelector('.search-btn');
const notFound = document.querySelector('.data-not-found');
const citySearch = document.querySelector('.search-city-container');
const weatherInfo = document.querySelector('.weather-info');
// const loader = document.querySelector('.loader');

let state = document.querySelector('.country-txt');
let cntry = document.querySelector('.country');
let date = document.querySelector('.current-date-txt');
let tempTxt = document.querySelector('.temp-txt');
let currWeather = document.querySelector('#currWeather');
let humdity = document.querySelector('#humidity');
let wind = document.querySelector('#windSpeed');
let weatherImg = document.querySelector('.weather-summary');

let forcastItemsContainer = document.querySelector('.forcast-items-container');

let apiKey = 'd0b3ee6f50c64e6f62573923a6a8fd48';

// loader.style.display = 'none';

searchBtn.addEventListener('click', () => {
    if (cityInput.value != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

function getCurrDate() {
    const currDate = new Date()
    const option = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currDate.toLocaleDateString('en-GB', option)
}

function getweatherIcons(id) {
    if (id <= 232) return 'thunderstorm.png';
    if (id <= 321) return 'Drizzle.png';
    if (id <= 531) return 'rain1.png';
    if (id <= 622) return 'snow1.png';
    if (id <= 781) return 'mist1.png';
    if (id <= 800) return 'clearsky.png';
    else return 'cloud2.png';
}

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if(weatherData.cod != 200){
        showDisplay(notFound)
        return
    }

    showDisplay(weatherInfo)

    const {
        name: cuntry,
        main: { temp, humidity
        },
        weather: [{ id, main }],
        wind: { speed },
        sys: { country },
    } = weatherData

    state.textContent = cuntry;
    cntry.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    currWeather.textContent = main;
    humdity.textContent = humidity + ' %';
    wind.textContent = speed + ' M/s';
    weatherImg.src = `images/${getweatherIcons(id)}`
    date.textContent = getCurrDate()

    await updateForecast(city)

}

function showDisplay(section){
    [weatherInfo, citySearch, notFound]
    .forEach(section => section.style.display = 'none');

    section.style.display = 'flex'
}

async function updateForecast(city) {
    const forecast = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forcastItemsContainer.innerHTML = ''

    forecast.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })

    function updateForecastItems(weatherData) {
        const {
            dt_txt: date,
            weather: [{ id }],
            main: { temp }
        } = weatherData

        const dateTaken = new Date(date)
        const dateOption = {
            day: '2-digit',
            month: 'short'
        }

        const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

        const forecastItems = `
            <div class="forcast-item">
                    <h5 class="forcast-item-date">${dateResult}</h5>
                    <img src="images/${getweatherIcons(id)}" class="forcast-img">
                    <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
                </div>
        `
        forcastItemsContainer.insertAdjacentHTML('beforeend', forecastItems)
    }
}


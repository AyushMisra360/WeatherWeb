
const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-button')


const weatheInfoSection = document.querySelector('.weather-location')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-text')
const tempTxt = document.querySelector('.temp-text')
const conditionTxt = document.querySelector('.condition-text')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')



const apiKey = 'd9f3a16d8ee01052b381e4731b781931'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }

})

function getWeatherIcon(id) {
    if(id <= 232) return`thunderstorm.svg`
    if(id <= 321) return`drizzle.svg`
    if(id <= 531) return`rain.svg`
    if(id <= 622) return`snow.svg`
    if(id <= 781) return`atmosphere.svg`
    if(id <= 800) return`clear.svg`
    else return `clouds.svg`
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday :'short',
        day : '2-digit',
        month : 'short',
    }

    return currentDate.toLocaleDateString('en-GB', options)
}
cityInput.addEventListener('keydown', (event) =>{
    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response =await fetch(apiUrl);

    return response.json()
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);



    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }

    

    const{
        name:country,
        main: {temp, humidity},
        weather:[{id, main}],
        wind:{speed}
    }= weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    windValueTxt.textContent = speed + ' M/s'
    humidityValueTxt.textContent = humidity + '%'
    currentDateTxt.textContent = getCurrentDate()
    

    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city);


     showDisplaySection(weatheInfoSection)
    
}

async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast',city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''

    forecastData.list.forEach(foreCastWeather => {
        if(foreCastWeather.dt_txt.includes(timeTaken) && !foreCastWeather.dt_txt.includes(todayDate)){
            updateForecastitems(foreCastWeather)
        }
        
    })

    
}

function updateForecastitems(weatherData){
    const {
        dt_txt:date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day:'short',
        day:'2-digit',
        month : 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-GB', dateOption)

    const forecastItem =`
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-text">${dateResult}</h5>
                <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
            </div>`

    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
}


function showDisplaySection(section){
    [weatheInfoSection,searchCitySection, notFoundSection]
    .forEach(section => section.style.display = 'none')


    section.style.display = 'flex'
}


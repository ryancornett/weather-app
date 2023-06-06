import { getSunsetSeconds, displayCurrentOutlook, displayForecastOutlooks } from './scripts/data.js';


// *** Begin weather forecast ***

// *** Request weather data ***
async function weather() {
    let today = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,rain,snowfall,cloudcover&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,snowfall_sum,precipitation_probability_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&forecast_days=3&timezone=America%2FNew_York')
      .then((response) => response.json());
    return today;
  };
  
  const currentDayTime = new Date();
  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayOfTheWeek = currentDayTime.getDay();
  let dayOne = week[dayOfTheWeek];
  let dayTwo = week[(dayOfTheWeek + 1) % 7];
  let dayThree = week[(dayOfTheWeek + 2) % 7];
  const forecastArray = [dayOne, dayTwo, dayThree];
  const currentIcon = document.querySelector('.current-icon');
  let currentHour = currentDayTime.getHours();
  let currentMinute = currentDayTime.getMinutes();
  let currentSecond = currentDayTime.getSeconds();
  let secondsSinceStartOfDay = (currentHour * 3600) + (currentMinute * 60) + currentSecond;
  const currentTemp = document.getElementById('temp');
  const highs = document.querySelectorAll('.high');
  const lows = document.querySelectorAll('.low');

// *** Get API weather data response ***  

  (async function displayCurrentTemp() {
    let response = await weather();
    
    // *** Get sunset time and compare it to current time ***
    getSunsetSeconds(response);

    displayCurrentOutlook(response, currentHour, secondsSinceStartOfDay, currentIcon);


  // *** Display current temperature ***

    let currentTempDisplayed = response.hourly.temperature_2m[currentHour];
    if (currentTempDisplayed < 0) {
      currentTemp.style.color = 'var(--color_below-zero)';
    } else if (currentTempDisplayed < 10 && currentTempDisplayed >= 0) {
      currentTemp.style.color = 'var(--color_zero-plus)';
    } else if (currentTempDisplayed < 20 && currentTempDisplayed >= 10) {
      currentTemp.style.color = 'var(--color_ten-plus)';
    } else if (currentTempDisplayed < 30 && currentTempDisplayed >= 20) {
      currentTemp.style.color = 'var(--color_twenty-plus)';
    } else if (currentTempDisplayed < 40 && currentTempDisplayed >= 30) {
      currentTemp.style.color = 'var(--color_thirty-plus)';
    } else if (currentTempDisplayed < 50 && currentTempDisplayed >= 30) {
      currentTemp.style.color = 'var(--color_forty-plus)';
    } else if (currentTempDisplayed < 60 && currentTempDisplayed >= 30) {
      currentTemp.style.color = 'var(--color_fifty-plus)';
    } else if (currentTempDisplayed < 70 && currentTempDisplayed >= 30) {
      currentTemp.style.color = 'var(--color_sixty-plus)';
    } else if (currentTempDisplayed < 80 && currentTempDisplayed >= 70) {
      currentTemp.style.color = 'var(--color_seventy-plus)';
    } else if (currentTempDisplayed < 90 && currentTempDisplayed >= 80) {
      currentTemp.style.color = 'var(--color_eighty-plus)';
    } else if (currentTempDisplayed < 100 && currentTempDisplayed >= 90) {
      currentTemp.style.color = 'var(--color_ninety-plus)';
    } else {
      currentTemp.style.color = 'var(--color_hundred-plus)';
    }
    currentTemp.innerText = currentTempDisplayed;

  // *** Display forecast icons ***

    displayForecastOutlooks(response);

  // *** Display forecast temperatures ***   

    let highTemps = response.daily.temperature_2m_max;
    for (let i = 0; i < highs.length; i++) {
    highs[i].textContent = `${highTemps[i]} °F`;
    }
    let lowTemps = response.daily.temperature_2m_min;
    for (let i = 0; i < lows.length; i++) {
      lows[i].textContent = `${lowTemps[i]} °F`;
    }
  })();
  
  // *** Display forecast days ***
  const dayHeaders = document.querySelectorAll('.day-header');
  for (let i = 0; i < dayHeaders.length; i++) {
    dayHeaders[i].textContent = forecastArray[i];
  }
  
// *** End weather forecast ***
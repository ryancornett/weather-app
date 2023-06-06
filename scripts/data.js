import { exports } from "./graphics.js";

function getSunsetSeconds(data) {
    let sunsetResponse = data.daily.sunset[0];
    let sunsetTime = sunsetResponse.slice(11);
    let sunsetHour = sunsetTime.slice(0, 2);
    let sunsetHourAdjusted = parseInt(sunsetHour) + 5;
    let sunsetMinute = sunsetTime.slice(-2);
    let sunsetMinuteParsed = parseInt(sunsetMinute);
    let sunsetSeconds = ((sunsetHourAdjusted * 3600) + (sunsetMinuteParsed * 60));
    return sunsetSeconds;
}

function displayCurrentOutlook(data, time, secondsElapsed, element) {
    let currentOutlook = data.hourly.cloudcover[time];
    const weatherApp = document.querySelector('.weather');
    
    // *** Set current icon to sunny by default ***
    element.innerHTML = exports[0];

    // *** Check if nighttime ***
    if (getSunsetSeconds(data) < secondsElapsed) {
        element.innerHTML = exports[5];
        weatherApp.getElementsByClassName.backgroundImage = 'linear-gradient(rgb(10, 12, 130), black);';
    };

    // *** Check if snowing ***
    if (data.hourly.snowfall[time] > 0) {
        element.innerHTML = exports[4];
    };

    // *** Check if raining ***
    if (data.hourly.rain[time] > 0) {
        element.innerHTML = exports[3];
    };

    // *** Check if cloudy ***
    if (currentOutlook >=75) {
        element.innerHTML = exports[2];
    };
 
    // *** Check if partly cloudy ***
    if (currentOutlook < 75 && currentOutlook >= 50) {
        element.innerHTML = exports[1];
    };
}

function avgCloudCover(startRangeIndex, endRangeIndex, array) {
    for (let i = startRangeIndex; i <= endRangeIndex; i++) {
        let dayArray = array.hourly.cloudcover.slice(startRangeIndex, endRangeIndex);
        let sum = dayArray.reduce(function(a, b){
            return a + b;
          });
        let avg = sum/24;
        return avg;
      }
};

function displayForecastOutlooks(data) {
    let dayOneOutlook = avgCloudCover(0, 23, data);
    let dayTwoOutlook = avgCloudCover(24, 47, data);
    let dayThreeOutlook = avgCloudCover(48, 71, data);
    const forecastOutlook = [dayOneOutlook, dayTwoOutlook, dayThreeOutlook];
    const forecastIcons = document.querySelectorAll('.forecast-icon');
    const precipPercentages = document.querySelectorAll('.precip-percentage');
    let precipOutlook = data.daily.precipitation_probability_max;
    for (let i = 0; i < forecastIcons.length; i++) {
        if (data.daily.snowfall_sum[i] > 0) {
            forecastIcons[i].innerHTML = exports[4];
            precipPercentages[i].textContent = `${precipOutlook[i]}%`;
        }
        else if (data.daily.rain_sum[i] > 0) {
            forecastIcons[i].innerHTML = exports[3];
            precipPercentages[i].textContent = `${precipOutlook[i]}%`;
        }
        else if (precipOutlook[i] >= 50) {
            forecastIcons[i].innerHTML = exports[3];
            precipPercentages[i].textContent = `${precipOutlook[i]}%`;
        }
        else if (precipOutlook[i] < 50 && forecastOutlook[i] > 75) {
            forecastIcons[i].innerHTML = exports[2];
            precipPercentages[i].textContent = `${precipOutlook[i]}%`;
        }
        else if (precipOutlook[i] < 50 && forecastOutlook[i] >= 50) {
            forecastIcons[i].innerHTML = exports[1];
            precipPercentages[i].textContent = `${precipOutlook[i]}%`;
        }
        else {
            forecastIcons[i].innerHTML = exports[0];
            precipPercentages[i].textContent = `${precipOutlook[i]}%`;
        }
    }
};

export { getSunsetSeconds, displayCurrentOutlook, displayForecastOutlooks };
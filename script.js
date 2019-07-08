function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

addLoadEvent(a);
addLoadEvent(function() {
    /* more code to run on page load */


});

document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.querySelector(".search-input").value;
    if (searchTerm)
        searchWeather(searchTerm);
});

function a() {
    let long;
    let lat;
    //let temperature = document.querySelector(".temperature");
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureSection = document.querySelector(".temperature-degree-section");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let temperatureUnit = document.querySelector(".temperature-unit");
    let locationTimezone = document.querySelector(".location-timezone");


    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = "https://cors-anywhere.herokuapp.com/";
            const api = `${proxy}https://api.darksky.net/forecast/1e66eb34c7961e937ac25f32d80429a9/${lat},${long}`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    //console.log(data);//JSON Response
                    //Fetch Data Shorthand from API Json Response
                    const { temperature, summary, icon } = data.currently;
                    //Set DOM Values
                    temperatureDegree.textContent = temperature;
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.timezone;
                    //Set Icon
                    setIcon(icon, document.querySelector(".icon"));
                    //Change temperature to Celsius/Fahrenheit
                    temperatureSection.addEventListener("click", () => {
                        if (temperatureUnit.textContent.match("°F")) {
                            temperatureUnit.textContent = "°C";
                            temperatureDegree.textContent = changeDegree(temperature);
                        } else {
                            temperatureUnit.textContent = "°F";
                            temperatureDegree.textContent = temperature;
                        }
                    });
                })
        });

    } else {
        h1.textContent = "Geolocation is not supported by this browser.";
    }
}

function setIcon(icon, iconID) {
    const skycons = new Skycons({ "color": "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}

function changeDegree(temperature) {
    return Math.floor((temperature - 32) * (5 / 9));
}

function searchWeather(searchTerm) {
    let apiKey = "58260e131217f2e5d931c0d95881b39e";
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&APPID=${apiKey}`)
        .then(response => {
            return response.json();
        })
        .then(response => {
            init(response);
        })

}

function init(resultFromServer) {
    console.log(resultFromServer);
    switch (resultFromServer.weather[0].main) {
        case "Clear":
            document.querySelector(".search-weather-container").style.backgroundImage = 'url("clear.jpg")';
            break;

        case "Clouds":
            document.querySelector(".search-weather-container").style.backgroundImage = 'url("clouds.jpg")';
            break;

        case "Rain":
        case "Drizzle":
        case "Mist":
            document.querySelector(".search-weather-container").style.backgroundImage = 'url("rain.jpg")';
            break;

        case "Thunderstorm":
            document.querySelector(".search-weather-container").style.backgroundImage = 'url("storm.jpg")';
            break;

        case "Snow":
            //document.querySelector(".search-weather-container").style.background = "black";
            break;

        default:
            //document.querySelector(".search-weather-container").style.background = "grey";
            break;
    }

    let temperatureDescription = document.querySelector(".search-temperature-description");
    let temperatureSection = document.querySelector(".search-temperature-degree-section");
    let temperatureDegree = document.querySelector(".search-temperature-degree");
    let temperatureUnit = document.querySelector(".search-temperature-unit");
    let locationTimezone = document.querySelector(".search-location-timezone");
    let weatherIcon = document.querySelector(".search-result-img");
    let weatherContainer = document.querySelector(".search-weather-container");

    weatherIcon.src = "http://openweathermap.org/img/wn/" + resultFromServer.weather[0].icon + ".png";
    let resultDesc = resultFromServer.weather[0].description;
    temperatureDescription.textContent = resultDesc.charAt(0).toUpperCase() + resultDesc.slice(1);

    let temperatureDegreeKelvin = Math.floor(resultFromServer.main.temp);
    let temperature = Math.floor((temperatureDegreeKelvin - 273) * (9 / 5) + 32);
    temperatureDegree.textContent = temperature;
    temperatureUnit.textContent = "°F";
    locationTimezone.textContent = resultFromServer.name;
    weatherContainer.style.visibility = "visible";

    temperatureSection.addEventListener("click", () => {
        if (temperatureUnit.textContent.match("°F")) {
            temperatureUnit.textContent = "°C";
            temperatureDegree.textContent = changeDegreeKelvin(temperature);
        } else {
            temperatureUnit.textContent = "°F";
            temperatureDegree.textContent = temperature;
        }
    });

}


function changeDegreeKelvin(temperature) {
    return Math.floor((temperature - 32) * (5 / 9));
}
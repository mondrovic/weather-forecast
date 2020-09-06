// Define elements for easier use
var searchInputEl = document.querySelector('#search-btn')
var searchFormEl = document.querySelector('#search-form')
var currentDayEl = document.querySelector('#current-day')
var fiveDayEl = document.querySelector('#five-day')
var cardContainerEl = document.querySelector('#card-container')

var currentTime = moment().format('MMM Do, YYYY')

var lat = 0
var lon = 0

// Handler for when user clicks submit button
var formSubmitHandler = function(){
    event.preventDefault();

    // gets value from search
    var cityState = searchInputEl.value.trim();
    // removes whitespace from search term
    cityState = cityState.replace(/ /g, '');
    // checks if search term is good then runs function
    if(cityState){
        getWeather(cityState);
        // clears out search from field
        searchInputEl.value = '';
    }else{
        alert('Please use {City, State} syntax without abbreviations');
    }
};


// Gets API data from openweathermap for current day and forecast
var getWeather = function(location){
    // format the open weather url for current
    var apiCurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&appid=23ccf9e8695292de833093bcb9dac5b7'

    // makes request to URL with fetch
    fetch(apiCurrent).then(function(response){
        // makes sure response status is ok
        if(response.ok){
            response.json().then(function(data){
                // saves variables to use in other fetch calls
                lat = data.coord.lat;
                lon = data.coord.lon;
                displayCurrent(data);
                // runs fetch command for forecast -- have to run the previous fetch command first because have no way to input lat/lon without it
                var apiForecast = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=current,minutely,hourly&units=imperial&appid=23ccf9e8695292de833093bcb9dac5b7'
                fetch(apiForecast).then(function(response){
                    if(response.ok){
                        response.json().then(function(forecast){
                            displayForecast(forecast);
                        });
                    } else{
                        alert('Error: ' + response.statusText);
                    }
                });                
            });
        } else{
            alert('Error: ' + response.statusText);
        }
    })
    // makes sure connection to server is solid
    .catch(function(error){
        alert('Unable to connect to Open Weather');
    });
};

// displays the current date's information
var displayCurrent = function(data){
    currentDayEl.textContent = '';
    
    // places name of location and time
    var cityDisplayEl = document.createElement('h4')
    cityDisplayEl.classList = 'p-2';
    cityDisplayEl.textContent = data.name + ' -- ' + currentTime;
    currentDayEl.appendChild(cityDisplayEl);

    var tempEl = document.createElement('p');
    tempEl.classList = 'p-2';
    tempEl.textContent = 'Current Temperature: ' + data.main.temp + '\u00B0F';
    currentDayEl.appendChild(tempEl);

    var humidityEl = document.createElement('p');
    humidityEl.classList = 'p-2';
    humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
    currentDayEl.appendChild(humidityEl);

    var windEl = document.createElement('p');
    windEl.classList = 'p-2';
    windEl.textContent = 'Wind speed: ' + data.wind.speed + ' MPH';
    currentDayEl.appendChild(windEl);

    // runs UV fetch function
    uvFetch(lat, lon)
}

// ---- 5 Day Forecast Start
var displayForecast = function(forecast){
    console.dir(forecast);
    // empties out cards
    cardContainerEl.textContent = '';

    // creates cards for next 5 days
    for(i = 0; i < 5; i++){
        var dailyCard = document.createElement('div');
        dailyCard.classList = 'card bg-primary text-light m-2';

        var dailyDate = document.createElement('h4');
        var newDate = moment(currentTime).clone().add(1, 'd');
        dailyDate.textContent = newDate;
        dailyCard.appendChild(dailyDate);

        var dailyTempEl = document.createElement('p');
        dailyTempEl.textContent = 'Temperature: ' + forecast.daily[i].temp.max + '\u00B0F';
        dailyCard.appendChild(dailyTempEl);

        var dailyHumidityEl = document.createElement('p');
        dailyHumidityEl.textContent = 'Humidity: ' + forecast.daily[i].humidity + '%';
        dailyCard.appendChild(dailyHumidityEl);

        cardContainerEl.appendChild(dailyCard);
    }
}

// ---- UV functions start. UV has different API call than regular weather    
// displays UV information to container*/
var displayUv = function(uvData){
    var uvEl = document.createElement('p');
    uvEl.classList = 'p-2';
    uvEl.textContent = 'UV Index: '

    var uvRisk = document.createElement('span');
    uvRisk.textContent = uvData.value;

    if(uvData.value <= 2){
        uvRisk.classList = 'low';
    }else if(uvData.value >2 && uvData.value <=5){
        uvRisk.classList = 'moderate';
    }else if(uvData.value >5 && uvData.value <=7){
        uvRisk.classList = 'high';
    }else if(uvData.value >7 && uvData.value <=10){
        uvRisk.classList = 'very-high';
    }else{
        uvRisk.classList = 'extreme';
    }

    uvEl.appendChild(uvRisk);
    currentDayEl.appendChild(uvEl);
}

// fetches UV index data then parses to json
var uvFetch = function(lat, lon){
    var uvApi = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=23ccf9e8695292de833093bcb9dac5b7';
    fetch(uvApi).then(function(response){
        if(response.ok){
            response.json().then(function(uvData){
                displayUv(uvData);
            });
        } else{
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error){
        alert('Unable to connect to Open Weather');
    })

}
// ---- UV functions end


// Event listener to run main handler
searchFormEl.addEventListener('submit', formSubmitHandler);
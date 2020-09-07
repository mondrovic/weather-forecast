// Define elements for easier use
var searchInputEl = document.querySelector('#search-btn')
var searchFormEl = document.querySelector('#search-form')
var currentDayEl = document.querySelector('#current-day')
var fiveDayEl = document.querySelector('#five-day')
var cardContainerEl = document.querySelector('#card-container')
var locationDateEl = document.querySelector('#location-date')
var searchContainerEl = document.querySelector('#search-container')

var recentCitiesArr = []

var currentTime = moment().format('MMM Do, YYYY')

$(document).ready(function(){
    
    // Handler for when user clicks submit button
    var formSubmitHandler = function(){
        event.preventDefault();


        // gets value from search
        var city = searchInputEl.value.trim();

        // saves to recentCitiesArr
        recentCitiesArr.push(city);
        saveCities();

        // checks if search term is good then runs function
        if(city){
            getWeather(city);
            // clears out search from field
            searchInputEl.value = '';
        }else{
            alert('Please search a city name');
        }
    };


    // Gets API data from openweathermap for current day and forecast
    var getWeather = function(city){
        // format the open weather url for current
        var apiCurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=23ccf9e8695292de833093bcb9dac5b7'

        // makes request to URL with fetch
        fetch(apiCurrent).then(function(response){
            // makes sure response status is ok
            if(response.ok){
                response.json().then(function(data){
                    // saves variables to use in other fetch calls
                    displayCurrent(data);

                    // runs fetch command for forecast -- have to run the previous fetch command first because have no way to input lat/lon without it
                    var apiForecast = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&exclude=current,minutely,hourly&units=imperial&appid=23ccf9e8695292de833093bcb9dac5b7'
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
        // empties out content
        currentDayEl.textContent = '';

        // places name of location and time
        locationDateEl.textContent = data.name

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
        uvFetch(data.coord.lat, data.coord.lon)
    }

    // ---- 5 Day Forecast Start
    var displayForecast = function(forecast){

        // empties out cards
        cardContainerEl.textContent = '';

        // creates cards for next 5 days
        for(i = 1; i < 6; i++){
            var dailyCard = document.createElement('div');
            dailyCard.classList = 'card bg-primary text-light m-2 col-3';

            var dailyDate = document.createElement('h4');
            dailyDate.classList = 'p-2'
            var nextDay = moment().add([i], 'day').format('MM/DD/YYYY');
            dailyDate.textContent = nextDay;
            dailyCard.appendChild(dailyDate);

            var dailyTempEl = document.createElement('p');
            dailyTempEl.classList = 'p-1'
            dailyTempEl.textContent = 'Temperature: ' + forecast.daily[i].temp.max + '\u00B0F';
            dailyCard.appendChild(dailyTempEl);

            var dailyHumidityEl = document.createElement('p');
            dailyHumidityEl.classList = 'p-1'
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

    // save to local

    var saveCities = function(){
        // converts string to lower case using map and arrow function
        var lowerCase = recentCitiesArr.map(v => v.toLowerCase());
        // makes sure only unique items get saved to array
        var uniqueCities = (Array.from(new Set(lowerCase)));
        
        localStorage.setItem('city', JSON.stringify(uniqueCities));
    }

    var loadCities = function(){
        recentCitiesArr = JSON.parse(localStorage.getItem('city'));

        if (!recentCitiesArr){
            recentCitiesArr = [];
        };

        for(i = 0; i < recentCitiesArr.length; i++){
            var displayCity = document.createElement('button');
            displayCity.classList = 'btn btn-outline-primary recent-btn'
            displayCity.textContent = recentCitiesArr[i];

            

            searchContainerEl.appendChild(displayCity);
        }
    }

    var recallHandler = function(event){
        if(event.target.classList.contains('recent-btn')){
            var recalledCity = event.target.textContent;
            getWeather(recalledCity);
        }
    }

    loadCities();

    // Event listener to run main handler
    searchFormEl.addEventListener('submit', formSubmitHandler);

    // Event listener to recall recent searches
    searchContainerEl.addEventListener('click', recallHandler);

});


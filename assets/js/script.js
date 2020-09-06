// Define elements for easier use
var searchInputEl = document.querySelector('#search-btn')
var searchFormEl = document.querySelector('#search-form')
var currentDayEl = document.querySelector('#current-day')
// var citySearchEl = document.querySelector('#city-search-term')
var currentTime = moment().format('MMM Do, YYYY')

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


// Gets API data from openweathermap
var getWeather = function(location){
    // format the open weather url
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&appid=23ccf9e8695292de833093bcb9dac5b7'
    // makes request ot URL with fetch
    fetch(apiUrl).then(function(response){
        // makes sure response status is ok
        if(response.ok){
            response.json().then(function(data){
                displayCurrent(data);
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
    currentDayEl.textContent = ''

    // sets variables for lat/lon        
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    
    // places name of location and time
    var cityDisplayEl = document.createElement('h4')
    cityDisplayEl.textContent = data.name + ' -- ' + currentTime;
    currentDayEl.appendChild(cityDisplayEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Current Temperature: ' + data.main.temp + '\u00B0F';
    currentDayEl.appendChild(tempEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
    currentDayEl.appendChild(humidityEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind speed: ' + data.wind.speed + ' MPH';
    currentDayEl.appendChild(windEl);

    // runs UV fetch function
    uvFetch(lat, lon)
}

// ---- UV functions start
    
// displays UV information to container*/
var displayUv = function(uvData){
    var uvEl = document.createElement('p');
    uvEl.textContent = 'UV Index: ' + uvData.value;
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
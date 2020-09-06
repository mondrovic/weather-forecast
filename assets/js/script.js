// Define elements for easier use
var searchInputEl = document.querySelector('#search-btn')
var searchFormEl = document.querySelector('#search-form')

// Handler for when user clicks submit button
var formSubmitHandler = function(){
    event.preventDefault();

    var cityState = searchInputEl.value.trim();
    console.log(cityState);
};

var getWeather = function(location){
    var apiUrl = 'api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=23ccf9e8695292de833093bcb9dac5b7'
};


// Event listener to run main handler
searchFormEl.addEventListener('submit', formSubmitHandler);
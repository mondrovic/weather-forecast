// Define elements for easier use
var searchInputEl = document.querySelector('#search-btn')
var searchFormEl = document.querySelector('#search-form')

// Handler for when user clicks submit button
var formSubmitHandler = function(){
    event.preventDefault();

    // gets value from search
    var cityState = searchInputEl.value.trim();
    cityState = cityState.replace(/ /g, '');
    console.log(cityState);
    // checks if search term is good then runs function
    if(cityState){
        getWeather(cityState);
        // clears out search from field
        searchInputEl.value = '';
    }else{
        alert('Please use {City, State} syntax without abbreviations');
    }
};

var getWeather = function(location){
    // format the open weather url
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&appid=23ccf9e8695292de833093bcb9dac5b7'
    // makes request ot URL with fetch
    fetch(apiUrl).then(function(response){
        // makes sure response status is ok
        if(response.ok){
            response.json().then(function(data){
                console.log(data, location);
            });
        } else{
            alert('Error: ' + response.statusText);
        }
    })
    // makes sure connection to server is solid
    .catch(function(error){
        alert("Unable to connect to Open Weather");
    });
    
};


// Event listener to run main handler
searchFormEl.addEventListener('submit', formSubmitHandler);
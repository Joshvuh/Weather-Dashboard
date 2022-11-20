// Weather API used https://openweathermap.org/forecast5
var APIKey = 'f771095d7d0470d976bdf30ad6f6d05c';
var city = 'Raleigh';
var todaysDate = dayjs().format('MM/DD/YYYY');
var searchHistory = [];
var upcomingWeatherEl = $('.upcomingWeather');
var todaysWeather = $('.todaysWeather');
var pastSearches = $('.pastSearches');

// Function to call the API with the city name under the cityInput button (getWeather calls the API)
// Pushes the searched city to local storage and searchHistory array, clears out the five day forecast cards so we don't get more than 5 cards at a time
// Does nothing if there is no city name typed in
$('.submitBtn').on('click', function(e) {
    e.preventDefault();
    city = $(this).siblings('.cityInput').val().trim();
    if(city == '') {
        return;
    };
    searchHistory.push(city);
    localStorage.setItem('city', JSON.stringify(searchHistory));
    upcomingWeatherEl.empty();
    getSearchHistory();
    getWeather();
});
// Function that stores searched cities under the search input field
// Prepends the latest search to the pastSearches div, so it's pushed to the top instead of the bottom
// PastSearches buttons are clickable, when clicking any of them it will run getWeather with that cityname
function getSearchHistory() {
    pastSearches.empty();
    for (var i = 0; i < searchHistory.length; i++) {
        var rowEl = $('<div>');
        var btnEl = $('<button>').text(`${searchHistory[i]}`);
        rowEl.addClass('row');
        btnEl.addClass('btn btn-outline-primary pastBtn mt-1');
        pastSearches.prepend(rowEl);
        rowEl.append(btnEl);
    }
    $('.pastBtn').click(function(e) {
        e.preventDefault;
        city = $(this).text();
        todaysWeather.empty;
        getWeather();
        upcomingWeatherEl.empty();
    });
};
// Main function to call the API, the top URL is to get today's weather, the lower one is to get the five day forecast
// Function creates the elements for both today's weather and the five day forecast
// Icons are pulled from openweathermap.org directly
// For the five day forecast the entire card is being created within JS, styling is added as well.
// AJAX used so we can call the API and update with page without refreshing the page
// The for loop for the five day API call is maybe not the best, I'm adding 9 to i with each loop until i is equal to or greater than 50. I did this because for the five day forecast, it gives us the temperature every 3 hours, there is likely a better way to do this but since I'm on a time crunch this was the most simple way to get a temperature for 5 unique days.
function getWeather(){
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
    todaysWeather.empty();
    $.ajax({
        url: queryURL,
        method: 'GET',
    }) .then(function (response){
            var tempEl = $('<p>').text(`Temperature: ${response.main.temp}°F`);
            var windEl = $('<p>').text(`Wind Speed: ${response.wind.speed} mph`);
            var humidityEl = $('<p>').text(`Humidity: ${response.main.humidity}%`);
            $('.cityName').text(response.name + ' - ' + todaysDate);
            $('.icon').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
            todaysWeather.append(tempEl);
            todaysWeather.append(windEl);
            todaysWeather.append(humidityEl);
    });
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;
    $.ajax({
        url: fiveDayURL,
        method: 'GET',
    }).then(function(response) {
        var fiveDayArray = response.list;
        for (var i = 0; i < 50; i=i+9) {
            var resultDiv = $('<div>');
            resultDiv.attr('class', 'card')
            resultDiv.attr('style', 'max-width: 300px; margin: 20px 0 20px 30px; background-color: rgb(107, 114, 142);');
            var resultDivHeader = $('<div>');
            resultDivHeader.attr('class', 'card-header');
            resultDivHeader.attr('style', 'max-width: 300px; padding: 10px;');
            var date = dayjs(`${fiveDayArray[i].dt_txt}`).format('MM/DD/YYYY');
            resultDivHeader.text(date);
            var resultDivBody = $('<div>');
            resultDivBody.attr('class', 'card-header');
            resultDivBody.attr('style', 'max-width: 300px; padding: 10px;');
            var resultDivIcon = $('<img>');
            resultDivIcon.attr('src', `https://openweathermap.org/img/wn/${fiveDayArray[i].weather[0].icon}@2x.png`);
            resultDivIcon.attr('style', 'height: 75px; width: 75px;');
            var resultTemp = $('<p>').text(`Temperature: ${fiveDayArray[i].main.temp}°F`);
            var resultWind = $('<p>').text(`Wind Speed: ${fiveDayArray[i].wind.speed} mph`);
            var resultHumidity = $('<p>').text(`Humidity: ${fiveDayArray[i].main.humidity}%`);
            upcomingWeatherEl.append(resultDiv);
            resultDiv.append(resultDivHeader);
            resultDiv.append(resultDivBody);
            resultDivBody.append(resultDivIcon);
            resultDivBody.append(resultTemp);
            resultDivBody.append(resultWind);
            resultDivBody.append(resultHumidity);
        }
    })
};
// Function runs on page load, it uses Raleigh as the cityName for an example so we can populate the page before the user even searches anything.
function initLoad() {
    var previousSearchStorage = JSON.parse(localStorage.getItem('city'));
	if (previousSearchStorage !== null) {
	    searchHistory = previousSearchStorage
    }
    getSearchHistory();
    getWeather();
};

initLoad();

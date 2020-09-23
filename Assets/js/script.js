//Getting histry from local storage
var getStoredSearchedHistory = JSON.parse(localStorage.getItem("searchedHistory"))
var searchedHistory = { lastcityName: [] }
init();

//Checking if there is any stored values
function init() {
    if (getStoredSearchedHistory !== null) {
        searchedHistory = getStoredSearchedHistory
        displayLastSearched();
        getTodayForecast(searchedHistory.lastcityName[searchedHistory.lastcityName.length - 1]);
        fiveDaysForecast(searchedHistory.lastcityName[searchedHistory.lastcityName.length - 1])
    }
    else {
        displayLastSearched();
    }
}

//When searched history button clicked 
function onSearchedHistoryButtonClicked() {
    var cityName = $(this).data("cityName");
    getTodayForecast(cityName);
    fiveDaysForecast(cityName)
}

//displaying the last searched values
function displayLastSearched() {
    $(".search-history").empty();
    $.each(searchedHistory.lastcityName, function (index, cityName) {
        var newHistoryLi = $("<li>").text(cityName).addClass("list-group-item list-group-item-action historyButton").data("cityName", cityName).css("cursor", "pointer");
        $(".search-history").prepend(newHistoryLi);
    })
}


//when search button is clicked
function onSearchButtonClicked(event) {
    event.preventDefault()
    var cityName = $("#search-city").val();
    if (cityName === "") {
        alert("Enter valid Input")
    }
    
    else {
        $("#search-city").val("")
        searchedHistory.lastcityName.push(cityName)
        displayLastSearched();
        storeSearchedHistory();
        getTodayForecast(cityName);
        fiveDaysForecast(cityName)
    }
}

//Calling an API for today weather forecast 
function getTodayForecast(cityName) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
        method: "GET"
    }).then(function (response) {
        $("#today").empty()
        //adding an element to appear on UI after getting response
        var icon = ("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>")
        var newDiv = $("<div>").addClass("card bg-secondary  mt-3")
        var panelHeading = $("<div>").addClass("card-body p-2")
        var nameDateIcon = $("<h3>").html(response.name + " (" + new Date().toLocaleDateString() + ")" + icon).addClass("card-title")
        var tempRow = $("<p>").text("Temperature : " + parseInt(response.main.temp -32)+ " °C").addClass("card-text")
        var humidRow = $("<p>").text("Humidity : " + response.main.humidity + " %").addClass("card-text")
        var windSpeedRow = $("<p>").text("Wind Speed : " + response.wind.speed + " MPH").addClass("card-text")
        var UV = $("<p>").addClass("card-text UV")
        $("#today").append(newDiv.append(panelHeading.append(nameDateIcon, tempRow, humidRow, windSpeedRow, UV)))
        getUvIndex(response.coord.lat, response.coord.lon);
    })
}

//Calling an API to get values of UV index
function getUvIndex(lat, lon) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=36e0a25f774c30702ff855cbef613566&lat=" + lat + "&lon=" + lon,
        method: "GET"
    }).then(function (response) {
        var UVIndex = $("<p>").text("UV Index: ");
        var UVButton = $("<span>").addClass("btn").text(response.value);
        if (response.value < 3) {
            UVButton.addClass("btn-success");
        }
        else if (response.value < 7) {
            UVButton.addClass("btn-warning");
        }
        else {
            UVButton.addClass("btn-danger");
        }
        $("#today .UV").append(UVIndex.append(UVButton));
    })
}

//Calling an API to get results for next five days forecast
function fiveDaysForecast(searchValue) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
        method: "GET"

    }).then(function (response) {
        console.log(response)
        $("#forecast").html("<h3> 5- day Forecast</h3>").append("<div class=\"row\">")
        for (var i = 0; i < response.list.length; i++) {
            //Only rendering the results if time is eqals to next day
            if (response.list[i].dt_txt.indexOf("00:00:00") !== -1) {
                var icon = ("<img src='https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png'>")
                var newCol = $("<div>").addClass("col-md")
                var newCard = $("<div>").addClass("card bg-primary text-white mt-3")
                var cardBody = $("<div>").addClass("card-body p-2")
                //Forecast date
                var newDate = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString())
                //Forecast icon
                var newIcon = $("<p>").html(icon)
                //description
                var description = $("<p>").text(response.list[i].weather[0].description)
                //Forecast temperature
                var newTemerature = $("<p>").addClass("card-text").text("Temp : " + parseInt(response.list[i].main.temp - 32) + " °C")

                 //Minimum Temperature
                 var windSpeed = $("<p>").addClass("card-text").text("Wind Speed : " + response.list[i].wind.speed)

                //Maximum Temperature
                var newMaxTemerature = $("<p>").addClass("card-text").text("Max Temp : " + parseInt(response.list[i].main.temp_max - 32) + " °C")
                //Forecast humidity
                var newHumidity = $("<p>").addClass("card-text").text("Humidity : " + response.list[i].main.humidity + " %")
                $("#forecast .row").append(newCol.append(newCard.append(cardBody.append(newDate, newIcon, description, newTemerature,windSpeed,newMaxTemerature, newHumidity))))
            }
        }
    })
}

//storing the searched history on local storage
function storeSearchedHistory() {
    localStorage.setItem("searchedHistory", JSON.stringify(searchedHistory))
}

//Creating the event handlers
$("li.historyButton").on("click", onSearchedHistoryButtonClicked)
$("#search-button").on("click", onSearchButtonClicked)
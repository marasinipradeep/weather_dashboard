

var getStoredSearchedHistory = JSON.parse(localStorage.getItem("searchedHistory"))
var searchedHistory = {
    lastcityName: []
}

init();
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

function onSearchedHistoryButtonClicked() {
    var cityName = $(this).data("cityName");
    getTodayForecast(cityName);
    fiveDaysForecast(cityName)
}

function displayLastSearched() {
    $(".search-history").empty();
    $.each(searchedHistory.lastcityName, function (index, cityName) {
        console.log(cityName)
        var newHistoryLi = $("<li>").text(cityName).addClass("list-group-item list-group-item-action historyButton").data("cityName",cityName).css("cursor","pointer");
        $(".search-history").prepend(newHistoryLi);
    })
}



function onSearchButtonClicked() {
    event.preventDefault()
    var cityName = $("#search-city").val();
    if (cityName === "") {
        alert("Enter valid Input")
    }
    else {
        $("#search-city").val("")
        searchedHistory.lastcityName.push(cityName)
        displayLastSearched();
        console.log(cityName)
       
        storeSearchedHistory();
        getTodayForecast(cityName);
        fiveDaysForecast(cityName)
    }
}

function getTodayForecast(cityName) {
    $.ajax({

        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
        method: "GET"
    }).then(function (response) {

        $("#today").empty()
        var todaydate = response.dt;
        var newDate = new Date().toLocaleDateString()
        var icon = ("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>")
        var newDiv = $("<div>").addClass("card bg-default  mt-3")
        var panelHeading = $("<div>").addClass("card-body p-2")
        var nameDateIcon = $("<h3>").html(response.name + " (" + newDate + ")" + icon).addClass("card-title")
        var tempRow = $("<p>").text("Temperature : " + response.main.temp + " °F").addClass("card-text")
        var humidRow = $("<p>").text("Humidity : " + response.main.humidity + " %").addClass("card-text")
        var windSpeedRow = $("<p>").text("Wind Speed : " + response.wind.speed + " MPH").addClass("card-text")
        var UV = $("<p>").addClass("card-text UV")
        panelHeading.append(nameDateIcon, tempRow, humidRow, windSpeedRow, UV)
        newDiv.append(panelHeading)
        $("#today").append(newDiv)
        getUvIndex(response.coord.lat, response.coord.lon);
    })
}

function getUvIndex(lat, lon) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=36e0a25f774c30702ff855cbef613566&lat=" + lat + "&lon=" + lon,
        method: "GET"
    }).then(function (response) {
        var uvIndex = $("<p>").text("UV Index: ");
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
        $("#today .UV").append(uvIndex.append(UVButton));
    })
}


function fiveDaysForecast(searchValue) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
        method: "GET"

    }).then(function (response) {
        console.log("response from five day forecast : "+JSON.stringify(response))

        $("#forecast").html("<h3> 5- day Forecast</h3>").append("<div class=\"row\">")

        for (var i = 0; i < response.list.length; i++) {

            if (response.list[i].dt_txt.indexOf("00:00:00") !== -1) {
            var icon = ("<img src='https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png'>")

            var col = $("<div>").addClass("col-md")
            var card = $("<div>").addClass("card bg-primary text-white mt-3")
            var body = $("<div>").addClass("card-body p-2")

            //Forecast date
            var newDate = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString())
            //Forecast icon
            var newIcon = $("<p>").html(icon)
            //Forecast temperature
            var newTemerature = $("<p>").addClass("card-text").text("Temp : " + response.list[i].main.temp + " °F")

            //Forecast humidity
            var newHumidity = $("<p>").addClass("card-text").text("Humidity : " + response.list[i].main.humidity + " %")
            body.append(newDate, newIcon, newTemerature, newHumidity)
            card.append(body)
            col.append(card)
            $("#forecast .row").append(col)
            }
        }
        
    })
}

function storeSearchedHistory() {
    localStorage.setItem("searchedHistory", JSON.stringify(searchedHistory))
}

$("li.historyButton").on("click", onSearchedHistoryButtonClicked)
$("#search-button").on("click", onSearchButtonClicked)

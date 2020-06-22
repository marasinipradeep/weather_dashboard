var historyEL = $(".search-history")
var searchCityEl = $("#search-city")
var todayEl = $("#today")
var forcastEl = $("#forecast")

var getStoredSearchedHistory = JSON.parse(localStorage.getItem("searchedHistory"))

//36e0a25f774c30702ff855cbef613566
// url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial"
//url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
//uvIndex
//url: "https://api.openweathermap.org/data/2.5/uvi?appid=7ba67ac190f85fdba2e2dc6b9d32e93c&lat=" + lat + "&lon=" + lon,

var searchedHistory = {
    lastcityName: []
}
init();
function init() {
    todayEl.empty()
        forcastEl.empty()
    if (getStoredSearchedHistory !== null) {
        searchedHistory = getStoredSearchedHistory
        displayLastSearched();

        console.log(searchedHistory.lastcityName[searchedHistory.lastcityName.length - 1])
        todayEl.empty()
        forcastEl.empty()
        getTodayForecast(searchedHistory.lastcityName[searchedHistory.lastcityName.length - 1]);
        fiveDaysForecast(searchedHistory.lastcityName[searchedHistory.lastcityName.length - 1])
    }
    else {
        //  storeSearchedHistory();
        displayLastSearched();
    }
}


function displayLastSearched() {
    historyEL.empty();
    $.each(searchedHistory.lastcityName, function (index, cityName) {
        console.log(cityName)
        var newHistoryLi = $("<button>").text(cityName).addClass("mt-3");
        historyEL.prepend(newHistoryLi);
    })
}



function onSearchButtonClicked() {
    event.preventDefault()
    todayEl.empty()
    forcastEl.empty()
    var cityName = searchCityEl.val();
    if (cityName === "") {
        alert("Enter valid Input")
    }
    else {
        searchedHistory.lastcityName.push(cityName)
        console.log(cityName)
        storeSearchedHistory();
        
        getTodayForecast(cityName);
        fiveDaysForecast(cityName)
    }
}

function getTodayForecast(cityName) {

    todayEl.empty()
    forcastEl.empty()
    $.ajax({

        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
        method: "GET"
    }).then(function (response) {
        console.log(response)
        // getUvIndex(response.coord.lat, response.coord.lon);
        var name = response.name
        var todaydate = response.dt;
        // var newDate = new Date(todaydate)
        // console.log("new date is : " + newDate)
        // var icon = response.weather[0].icon;
        var icon = ("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>")

        var temp = response.main.temp
        var humid = response.main.humidity
        var windSpeed = response.wind.speed
        console.log(name, temp, humid, windSpeed)

        var newDiv = $("<div>").addClass("container")

        var divHoldingNameDateAndIcon = $("<div>").addClass("row panel-heading")

        var nameRow = $("<h4>").addClass("display-4")
        nameRow.html(name + " (" + todaydate + ")" + icon)

        divHoldingNameDateAndIcon.append(nameRow)

        var tempRow = $("<h5>").addClass("display-6")
        tempRow.text("Temperature : " + temp)

        var humidRow = $("<h5>").addClass("display-6")
        humidRow.text("Humidity : " + humid)

        var windSpeedRow = $("<h5>").addClass("display-6")
        windSpeedRow.text("Wind Speed : " + windSpeed)

        newDiv.append(divHoldingNameDateAndIcon, tempRow, humidRow, windSpeedRow)
        todayEl.append(newDiv)
    })


}

function getUvIndex(lat, lon) {

    console.log("the value of lat is : " + lat + "and value of lon is :" + lon)
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=36e0a25f774c30702ff855cbef613566&lat=" + lat + "&lon=" + lon,
        method: "GET"
    }).then(function (response) {
        console.log(response.value)
    })
}


function fiveDaysForecast(searchValue) {
    console.log(" inside fivedays forecast : " + searchValue)
    todayEl.empty()
    forcastEl.empty()

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial&cnt=5",
        method: "GET"

    }).then(function (response) {

        // console.log("fivedays forecast is : " +JSON.stringify(response))
        for (i = 0; i < 5; i++) {
            var forcast_date = response.list[i].dt
            var temperaute = response.list[i].main.temp
            var humidity = response.list[i].main.humidity
            // var icon = response.list[0].weather[0].icon
            var icon = ("<img src='https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png'>")

            var newForcastDiv = $("<div>").addClass("column  mt-3")
            var newUl = $("<ul>").addClass("card list-group list-group-flush")

            //Forecast date
            var newDate = $("<li>").addClass("list-group-item")
            newDate.text("Date : " + forcast_date)

            //Forecast temperature
            var newTemerature = $("<li>").addClass("list-group-item")
            newTemerature.text("Temperature : " + temperaute)


            //Forecast humidity
            var newHumidity = $("<li>").addClass("list-group-item")
            newHumidity.text("Humidity : " + humidity)

            //Forecast icon
            var newIcon = $("<li>").addClass("list-group-item")
            newIcon.html(icon)

            newUl.append(newDate, newIcon, newTemerature, newHumidity)
            newForcastDiv.append(newUl)
            forcastEl.append(newForcastDiv)

            //         <div class="card" style="width: 18rem;">
            //   <ul class="list-group list-group-flush">
            //     <li class="list-group-item">Cras justo odio</li>
            //     <li class="list-group-item">Dapibus ac facilisis in</li>
            //     <li class="list-group-item">Vestibulum at eros</li>
            //   </ul>
            // </div>
        }
    })

}

function storeSearchedHistory() {
    localStorage.setItem("searchedHistory", JSON.stringify(searchedHistory))
    init();
}
//current weather

//name:response.name
//icon: response.weather[0].icon
//temp:response.main.temp
//humid:response.main.humidity
//windSpeed:response.wind.speed
//UVIndex:response.

//main.temp Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
//main.humidity Humidity, %
//wind.speed Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
//dt Time of data calculation, unix, UTC
//name City name
//weather.icon Weather icon id

//5 Days
//dt: response.list[0].dt

//response.list[0].main.temp

//response.list[0].main.humidity

//response.list[0].weather[0].icon

$("#search-button").on("click", onSearchButtonClicked)
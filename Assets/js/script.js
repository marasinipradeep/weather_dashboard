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



function onSearchedHistoryButtonClicked(){
    console.log("searched button clicked")
    var cityName = $(this).data("cityName");
    console.log(cityName)
    getTodayForecast(cityName);
    fiveDaysForecast(cityName)
}

function displayLastSearched() {
    historyEL.empty();
    $.each(searchedHistory.lastcityName, function (index, cityName) {
        console.log(cityName)
        var newHistoryLi = $("<button>").text(cityName).addClass("mt-3 historyButton").data("cityName",cityName);
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
        
        var name = response.name
        var todaydate = response.dt;

      
         var newDate =   new Date().toLocaleDateString()
        // console.log("new date is : " + newDate)
        // var icon = response.weather[0].icon;
        var icon = ("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>")

        var temp = response.main.temp
        var humid = response.main.humidity
        var windSpeed = response.wind.speed
        console.log(name, temp, humid, windSpeed)

        var newDiv = $("<div>").addClass("container")

        var divHoldingNameDateAndIcon = $("<div>").addClass("row panel-heading")

        var nameRow = $("<h5>").addClass("display-4")
        nameRow.html(name + " (" + newDate + ")" + icon)

        divHoldingNameDateAndIcon.append(nameRow)

        var tempRow = $("<p>").addClass("display-6")
        tempRow.text("Temperature : " + temp +" °F")

        var humidRow = $("<p>").addClass("display-6")
        humidRow.text("Humidity : " + humid +" %")

        var windSpeedRow = $("<p>").addClass("display-6 windSpeed")
        windSpeedRow.text("Wind Speed : " + windSpeed +" MPH")

        newDiv.append(divHoldingNameDateAndIcon, tempRow, humidRow, windSpeedRow)
        todayEl.append(newDiv)

         getUvIndex(response.coord.lat, response.coord.lon);


    })


}

function getUvIndex(lat, lon) {

    console.log("the value of lat is : " + lat + "and value of lon is :" + lon)
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=36e0a25f774c30702ff855cbef613566&lat=" + lat + "&lon=" + lon,
        method: "GET"
    }).then(function (response) {
        console.log(response.value)

        var uvIndex = $("<p>").text("UV Index: ");
        var UVButton = $("<span>").addClass("btn btn-sm").text(response.value);
        
        
        if (response.value < 3) {
            UVButton.addClass("btn-success");
        }
        else if (response.value < 7) {
            UVButton.addClass("btn-warning");
        }
        else {
            UVButton.addClass("btn-danger");
        }
        
        $("#today .windSpeed").append(uvIndex.append(UVButton));
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

         console.log("fivedays forecast is : " +JSON.stringify(response))
         $("#forecast").html("<h2>5- day Forecast</h2>").append("<div class=\"row\">")
        for (i = 0; i < 5; i++) {
            var forcast_date = response.list[i].dt_txt
            // var fomattedForcastDate =new Date(forcast_date).toLocaleDateString()
            var temperaute = response.list[i].main.temp
            var humidity = response.list[i].main.humidity
            // var icon = response.list[0].weather[0].icon
            var icon = ("<img src='https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png'>")

            var col = $("<div>").addClass("col-md-2")
            var card =$("<div>").addClass("card bg-primary text-white mt-3")
            var body = $("<div>").addClass("card-body p-2")

            //Forecast date
            var newDate = $("<h5>").addClass("card-title").text(new Date (forcast_date).toLocaleDateString())


            //Forecast icon
            var newIcon = $("<p>").html(icon)

            //Forecast temperature
            var newTemerature = $("<p>").addClass("card-text").text("Temp : " + temperaute + " °F")


            //Forecast humidity
            var newHumidity = $("<p>").addClass("card-text").text("Humidity : " + humidity +" %")


            body.append(newDate, newIcon, newTemerature, newHumidity)
            card.append(body)
            col.append(card)
           // newForcastDiv.append(col)
           
            $("#forecast .row").append(col)
        }
    })

}

function storeSearchedHistory() {
    localStorage.setItem("searchedHistory", JSON.stringify(searchedHistory))
    init();
}


$("button.historyButton").on("click", onSearchedHistoryButtonClicked)
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
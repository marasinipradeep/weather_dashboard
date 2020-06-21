

var historyEL = $(".search-history")
var searchCityEl = $("#search-city")
var todayEl = $("#today")
var forcastEl = $("#forecast")

var getStoredSearchedHistory = JSON.parse(localStorage.getItem("searchedHistory"))

//36e0a25f774c30702ff855cbef613566

// url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial"

//url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",

//uvIndex
//url: "http://api.openweathermap.org/data/2.5/uvi?appid=7ba67ac190f85fdba2e2dc6b9d32e93c&lat=" + lat + "&lon=" + lon,



init();
function init() {
    if (getStoredSearchedHistory !== null) {
        searchedHistory = getStoredSearchedHistory
        displayLastSearched();
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

var searchedHistory = {
    lastcityName: []
}

function onSearchButtonClicked() {
    event.preventDefault()
    var cityName = searchCityEl.val();
    if (cityName === "") {
        alert("Enter valid Input")
    }
    else {
        searchedHistory.lastcityName.push(cityName)
        console.log(cityName)
        storeSearchedHistory();

        $.ajax({

            url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial",
            method: "GET"
        }).then(function (response) {
            console.log(response)

           // getUvIndex(response.coord.lat, response.coord.lon);

           var name=response.name
           var todaydate = response.dt;
          // var icon = response.weather[0].icon;
           var icon = ("<img src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>")
          
           var temp=response.main.temp
           var humid=response.main.humidity
           var windSpeed=response.wind.speed
           console.log(name,temp,humid,windSpeed)

           var newDiv = $("<div>")

               var nameRow = $("<div>").addClass("row")
               nameRow.text(name)

               var DateRow = $("<div>").addClass("row")
               DateRow.text(todaydate)

               var iconRow = $("<div>").addClass("row")
               iconRow.html(icon)

               var tempRow = $("<div>").addClass("row")
               tempRow.text(temp)

               var humidRow = $("<div>").addClass("row")
               humidRow.text(humid)

               var windSpeedRow = $("<div>").addClass("row")
               windSpeedRow.text(windSpeed)

               newDiv.append(nameRow,todaydate,icon, tempRow, humidRow, windSpeedRow)
               todayEl.append(newDiv)
        })

       // fiveDaysForecast(cityName)

    }
}

function getUvIndex(lat, lon){

    console.log("the value of lat is : " +lat +"and value of lon is :"+ lon)

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/uvi?appid=36e0a25f774c30702ff855cbef613566&lat=" + lat + "&lon=" + lon,
        method:"GET"
    }).then(function(response){
        console.log(response.value)
    })
}


function fiveDaysForecast(searchValue) {
    console.log(" inside fivedays forecast : " +searchValue)

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=36e0a25f774c30702ff855cbef613566&units=imperial&cnt=5",
        method: "GET"

    }).then(function (response) {

        // console.log("fivedays forecast is : " +JSON.stringify(response))
        var forcast_date = response.list[0].dt

        var temperaute = response.list[0].main.temp

        var humidity = response.list[0].main.humidity

       // var icon = response.list[0].weather[0].icon

        var icon = ("<img src='http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png'>")

        var newForcastDiv = $("<div>")


        //Forecast date
            var newDate = $("<div>").addClass("row")
            newDate.text(forcast_date)

            //Forecast temperature
            var newTemerature = $("<div>").addClass("row")
            newTemerature.text(temperaute)


            //Forecast humidity
            var newHumidity = $("<div>").addClass("row")
            newHumidity.text(humidity)

            //Forecast icon
            var newIcon = $("<div>").addClass("row")
            newIcon.html(icon)

            newForcastDiv.append(newDate,newIcon,newTemerature,newHumidity)
            forcastEl.append(newForcastDiv)

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
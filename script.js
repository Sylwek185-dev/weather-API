const input = document.querySelector('input');
const buttonFind = document.querySelector('.find');
const buttonGPS = document.querySelector('.gps');

const cityName = document.querySelector('.city-name');
const warning = document.querySelector('.warning');
const photo = document.querySelector('.photo');
const weather = document.querySelector('.weather');
const temperature = document.querySelector('.temperature');
const humidity = document.querySelector('.humidity');

const cityActual = document.querySelector('.city');
const mainTemperature = document.querySelector('.main-temperature');
const mainDescription = document.querySelector('.main-description');
const mainFeelsTemp = document.querySelector('.main-feels-temp');
const mainPressure = document.querySelector('.main-pressure');
const mainWind = document.querySelector('.main-wind');
const mainHumidity = document.querySelector('.main-humidity');

const dateInfo = document.querySelector('.date-info');
const time = document.querySelector('.time');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const place = document.querySelector('.input-city');

const timeSunrise = document.querySelector('.time-sunrise');
const timeSunset = document.querySelector('.time-sunset');

//----------------------------------------------
//

let API_KEY = '&appid=2a6ac78f65cbd6c97309d3c17586be44'; //api key
let API_UNITS = '&units=metric&lang=pl'; //units polish
let API_GEOTAGING_LINK = 'https://api.openweathermap.org/geo/1.0/direct?q='; //link decoding geolocalisation
let API_WEATHER_LINK = `https://api.openweathermap.org/data/2.5/forecast?lat=`; //link callback weather

let latitude = 0; //cordinates
let longitude = 0; //cordinates
let cityBig;
let tempBig = 0;
let decriptBig;
let feelsTemp = 0;
let pressureValue = 0;
let windValue = 0;
let humidityValue = 0;
let statusId = 0;
let sunriseUNIX = 0;
let sunsetUNIX = 0;

//----------------------------------------------
//get cordinates via city name

const getGeotaging = () => {
	const API_CITY_NAME = input.value || 'Warszawa';
	const URL_GEOCODING =
		API_GEOTAGING_LINK + API_CITY_NAME + API_KEY + API_UNITS;

	axios
		.get(URL_GEOCODING)

		.then((res) => {
			latitude = res.data[0].lat;
			longitude = res.data[0].lon;
			cityBig = res.data[0].local_names.pl;
			getWeather();
		})
		.catch(() => {
			place.setAttribute('placeholder', 'Podaj poprawną nazwę');
		});
};

//----------------------------------------------
//get weather

const getWeather = () => {
	const URL_WEATHER =
		API_WEATHER_LINK + latitude + '&lon=' + longitude + API_KEY + API_UNITS;

	axios
		.get(URL_WEATHER)

		.then((res) => {
			tempBig = res.data.list[0].main.temp;
			// cityBig = res.data.city.name; // jesli zuzyje tej metody to bedzie pokazywac wiecej miejscowosci ale wskaze np dzielnice Środmiescie zamiast Kraków
			decriptBig = res.data.list[0].weather[0].description;
			feelsTemp = res.data.list[0].main.feels_like;
			pressureValue = res.data.list[0].main.pressure;
			windValue = res.data.list[0].wind.speed;
			humidityValue = res.data.list[0].main.humidity;
			statusId = res.data.list[0].weather[0].id;
			sunriseUNIX = res.data.city.sunrise;
			sunsetUNIX = res.data.city.sunset;

			showMainTemperature();
			showMainDescription();
			showCityName();
			showFeelsTemp();
			showPressure();
			showWind();
			showHumidity();
			logo();
			showDate();
			showSunrise();
			showSunset();
		})

		.catch(() => {
			place.setAttribute('placeholder', 'Brak tej miejscowości w bazie danych');
		});
};

const getGPS = () => {
	const geo = navigator.geolocation;

	if (geo) {
		geo.getCurrentPosition(function (location) {
			let latitude = location.coords.latitude;
			let longitude = location.coords.longitude;

			axios
				.get(
					API_WEATHER_LINK +
						latitude +
						'&lon=' +
						longitude +
						API_KEY +
						API_UNITS
				)
				.then((res) => {
					cityBig = res.data.city.name; // Pobieranie nazwy miasta
					getWeather(); // Po pobraniu nazwy miasta pobieramy dane pogodowe
				})
				.catch(() => {
					console.log('');
				});
		});
	} else {
		console.log('Geolokalizacja niedostępna.');
	}
};

//----------------------------------------------
//show city name in title

const showCityName = () => {
	cityActual.innerHTML = cityBig;
};

//----------------------------------------------
//show main temperature

const showMainTemperature = () => {
	mainTemperature.innerHTML = `${Math.floor(tempBig)} &#176C`;
};

const showMainDescription = () => {
	mainDescription.innerHTML =
		decriptBig.charAt(0).toUpperCase() + decriptBig.slice(1);
};

const showFeelsTemp = () => {
	mainFeelsTemp.innerHTML = `Odczuwalna ${Math.floor(feelsTemp)} &#176C`;
};

const showPressure = () => {
	mainPressure.innerHTML = `Ciśnienie ${pressureValue} hPa`;
};

const showWind = () => {
	mainWind.innerHTML = `Wiatr ${Math.floor((windValue / 1000) * 3600)} km/h`;
};

const showHumidity = () => {
	mainHumidity.innerHTML = `Wilgotność ${humidityValue} %`;
};

//----------------------------------------------
//get images weather

const logo = () => {
	if (statusId >= 200 && statusId < 300) {
		photo.setAttribute('src', 'img/thunderstorm.png');
	} else if (statusId >= 300 && statusId < 400) {
		photo.setAttribute('src', 'img/drizzle.png');
	} else if (statusId >= 500 && statusId < 600) {
		photo.setAttribute('src', 'img/rain.png');
	} else if (statusId >= 600 && statusId < 700) {
		photo.setAttribute('src', 'img/ice.png');
	} else if (statusId >= 700 && statusId < 800) {
		photo.setAttribute('src', 'img/fog.png');
	} else if (statusId === 800) {
		photo.setAttribute('src', 'img/sun.png');
	} else if (statusId >= 800 && statusId < 900) {
		photo.setAttribute('src', 'img/cloud.png');
	} else {
		photo.setAttribute('src', 'img/unknown.png');
	}
};

//----------------------------------------------
//show actual time

const showDate = () => {
	const data = new Date();
	const currentHour = data.getHours();
	const currentMinute = data.getMinutes();
	const nowTime = `Teraz ${currentHour}:${currentMinute}`;
	time.innerHTML = nowTime;
};

//----------------------------------------------
//send query for Enter button

const sendEnter = (e) => {
	if (e.key === 'Enter') {
		getGeotaging();
		input.value = '';
	}
};

//----------------------------------------------
//show sunrise time

const showSunrise = () => {
	let date = new Date(sunriseUNIX * 1000);

	let hours = date.getHours();
	let minutes = date.getMinutes();

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	const formattedTime = hours + ':' + minutes;
	timeSunrise.innerHTML = formattedTime;
};

const showSunset = () => {
	let date = new Date(sunsetUNIX * 1000);

	let hours = date.getHours();
	let minutes = date.getMinutes();

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	const formattedTime = hours + ':' + minutes;
	timeSunset.innerHTML = formattedTime;
};

input.addEventListener('keyup', sendEnter);
buttonFind.addEventListener('click', getGeotaging);
buttonGPS.addEventListener('click', getGPS);
getGeotaging();
getWeather();

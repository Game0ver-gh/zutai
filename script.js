document.getElementById('weather-button').addEventListener('click', function() {
    const address = document.getElementById('address-input').value;
    getCurrentWeather(address);
    getForecast(address);
});

function getCurrentWeather(address) {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${apiKey}&units=metric`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

	console.log("Req to Current Weather API sent! Waiting for resp...");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log("Resp from Current Weather API: ", response);
                displayCurrentWeather(response);
            } else {
                console.error("Error in Current Weather API request:", xhr.statusText);
            }
        }
    };

    xhr.send();
}

function getForecast(address) {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${address}&appid=${apiKey}&units=metric`;

	console.log("Req to Forecast API sent! Waiting for resp...");

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resp from Forecast API: ", data);
            displayForecast(data);
        })
        .catch(error => {
            console.error("Error in Forecast API request: ", error);
        });
}

function displayCurrentWeather(data) {
    const element = document.getElementById('current-weather');
    element.innerHTML = `
        <h2>Aktualna Pogoda dla ${data.name}</h2>
        <p>Temperatura: ${data.main.temp} °C</p>
        <p>Pogoda: ${data.weather[0].main} (${data.weather[0].description})</p>
    `;
}

function displayForecast(data) {
    const element = document.getElementById('forecast-weather');
    let forecastHTML = `<h2>Prognoza 5-dniowa dla ${data.city.name}</h2>`;

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            forecastHTML += `
                <p>Data: ${forecast.dt_txt}</p>
                <p>Temperatura: ${forecast.main.temp} °C</p>
                <p>Pogoda: ${forecast.weather[0].main} (${forecast.weather[0].description})</p>
                <hr>
            `;
        }
    });

    element.innerHTML = forecastHTML;
	
	const dates = data.list.map(item => item.dt_txt);
    const temperatures = data.list.map(item => item.main.temp);

    createChart(dates, temperatures);
}

function createChart(dates, temperatures) {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    const weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperatura °C',
                data: temperatures,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    document.getElementById('weather-chart').style.display = 'block';
}

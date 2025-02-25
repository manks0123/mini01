let sensorData = {
    temperature: 25, 
    humidity: 65,    
    soilMoisture: 35 
};

function updateSensorData() {
    sensorData.temperature += (Math.random() - 0.5) * 2;
    sensorData.humidity += (Math.random() - 0.5) * 5;
    sensorData.soilMoisture += (Math.random() - 0.5) * 3;

    document.getElementById("temperature-value").textContent = sensorData.temperature.toFixed(1) + " °C";
    document.getElementById("humidity-value").textContent = sensorData.humidity.toFixed(1) + " %";
    document.getElementById("soil-moisture-value").textContent = sensorData.soilMoisture.toFixed(1) + " %";

    sensorChart.data.datasets[0].data.push(sensorData.temperature);
    sensorChart.data.datasets[1].data.push(sensorData.humidity);
    sensorChart.data.datasets[2].data.push(sensorData.soilMoisture);

    if (sensorChart.data.labels.length >= 10) {
        sensorChart.data.labels.shift();
        sensorChart.data.datasets[0].data.shift();
        sensorChart.data.datasets[1].data.shift();
        sensorChart.data.datasets[2].data.shift();
    }

    const currentTime = new Date().toLocaleTimeString();
    sensorChart.data.labels.push(currentTime);

    sensorChart.update();
}

const ctx = document.getElementById("sensorChart").getContext("2d");
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], 
        datasets: [
            {
                label: 'Temperature (°C)',
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [] 
            },
            {
                label: 'Humidity (%)',
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                data: [] 
            },
            {
                label: 'Soil Moisture (%)',
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                data: [] 
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    }
});

setInterval(updateSensorData, 5000);

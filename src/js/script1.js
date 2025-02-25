// Mock data for real-time sensor updates
let sensorData = {
    temperature: 25, // Initial temperature
    humidity: 65,    // Initial humidity
    soilMoisture: 35 // Initial soil moisture
};

// Function to update real-time sensor data
function updateSensorData() {
    // Simulate real-time data updates by randomly adjusting the values
    sensorData.temperature += (Math.random() - 0.5) * 2;
    sensorData.humidity += (Math.random() - 0.5) * 5;
    sensorData.soilMoisture += (Math.random() - 0.5) * 3;

    // Update the text on the dashboard
    document.getElementById("temperature-value").textContent = sensorData.temperature.toFixed(1) + " °C";
    document.getElementById("humidity-value").textContent = sensorData.humidity.toFixed(1) + " %";
    document.getElementById("soil-moisture-value").textContent = sensorData.soilMoisture.toFixed(1) + " %";

    // Update the chart data
    sensorChart.data.datasets[0].data.push(sensorData.temperature);
    sensorChart.data.datasets[1].data.push(sensorData.humidity);
    sensorChart.data.datasets[2].data.push(sensorData.soilMoisture);

    // Keep the chart data limited to the last 10 points
    if (sensorChart.data.labels.length >= 10) {
        sensorChart.data.labels.shift();
        sensorChart.data.datasets[0].data.shift();
        sensorChart.data.datasets[1].data.shift();
        sensorChart.data.datasets[2].data.shift();
    }

    // Add new label (representing time)
    const currentTime = new Date().toLocaleTimeString();
    sensorChart.data.labels.push(currentTime);

    // Update the chart display
    sensorChart.update();
}

// Chart.js configuration for sensor data chart
const ctx = document.getElementById("sensorChart").getContext("2d");
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // X-axis labels (e.g., time)
        datasets: [
            {
                label: 'Temperature (°C)',
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [] // Temperature data points
            },
            {
                label: 'Humidity (%)',
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                data: [] // Humidity data points
            },
            {
                label: 'Soil Moisture (%)',
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                data: [] // Soil moisture data points
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

// Update sensor data and chart every 5 seconds
setInterval(updateSensorData, 5000);

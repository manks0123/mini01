
        // Initial sensor data
        let sensorData = {
            temperature: 25, 
            humidity: 65,    
            soilMoisture: 35 
        };

        // Function to update sensor data and chart
        function updateSensorData() {
            // Simulate sensor data changes
            sensorData.temperature += (Math.random() - 0.5) * 2;
            sensorData.humidity += (Math.random() - 0.5) * 5;
            sensorData.soilMoisture += (Math.random() - 0.5) * 3;

            // Keep values in reasonable ranges
            sensorData.temperature = Math.max(10, Math.min(40, sensorData.temperature));
            sensorData.humidity = Math.max(20, Math.min(95, sensorData.humidity));
            sensorData.soilMoisture = Math.max(10, Math.min(90, sensorData.soilMoisture));

            // Update display values
            document.getElementById("temperature-value").textContent = sensorData.temperature.toFixed(1) + " °C";
            document.getElementById("humidity-value").textContent = sensorData.humidity.toFixed(1) + " %";
            document.getElementById("soil-moisture-value").textContent = sensorData.soilMoisture.toFixed(1) + " %";

            // Update chart data
            sensorChart.data.datasets[0].data.push(sensorData.temperature);
            sensorChart.data.datasets[1].data.push(sensorData.humidity);
            sensorChart.data.datasets[2].data.push(sensorData.soilMoisture);

            // Remove old data points if more than 10
            if (sensorChart.data.labels.length >= 10) {
                sensorChart.data.labels.shift();
                sensorChart.data.datasets[0].data.shift();
                sensorChart.data.datasets[1].data.shift();
                sensorChart.data.datasets[2].data.shift();
            }

            // Add current time as label
            const currentTime = new Date().toLocaleTimeString();
            sensorChart.data.labels.push(currentTime);
            
            // Update last update time
            document.getElementById("last-update").textContent = "Last update: " + currentTime;

            // Update the chart
            sensorChart.update();
        }

        // Initialize chart
        document.addEventListener('DOMContentLoaded', function() {
            // Initial sensor values
            document.getElementById('temperature-value').textContent = sensorData.temperature.toFixed(1) + " °C";
            document.getElementById('humidity-value').textContent = sensorData.humidity.toFixed(1) + " %";
            document.getElementById('soil-moisture-value').textContent = sensorData.soilMoisture.toFixed(1) + " %";
            
            // Initialize chart with first data point
            const currentTime = new Date().toLocaleTimeString();
            sensorChart.data.labels.push(currentTime);
            sensorChart.data.datasets[0].data.push(sensorData.temperature);
            sensorChart.data.datasets[1].data.push(sensorData.humidity);
            sensorChart.data.datasets[2].data.push(sensorData.soilMoisture);
            sensorChart.update();
            
            // Start the interval for updates
            setInterval(updateSensorData, 5000);
        });

        // Create chart
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
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        data: [] 
                    },
                    {
                        label: 'Humidity (%)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        data: [] 
                    },
                    {
                        label: 'Soil Moisture (%)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        data: [] 
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Real-time Sensor Data',
                        font: {
                            size: 14
                        },
                        padding: {
                            top: 5,
                            bottom: 10
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Time',
                            font: {
                                size: 11
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value',
                            font: {
                                size: 11
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                animation: {
                    duration: 800
                },
                hover: {
                    mode: 'nearest',
                    intersect: false
                }
            }
        });

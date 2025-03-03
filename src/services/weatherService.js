const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error('Weather data could not be fetched');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };
  
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Error getting location:', error);
          // Default to a standard location if geolocation fails
          resolve({
            latitude: 40.7128, // New York
            longitude: -74.0060
          });
        }
      );
    });
  };
  
  // Weather code interpretation
  const getWeatherDescription = (weatherCode) => {
    const weatherMap = {
      0: { type: 'clear', description: 'Clear sky', icon: '☀️' },
      1: { type: 'clear', description: 'Mainly clear', icon: '🌤️' },
      2: { type: 'cloudy', description: 'Partly cloudy', icon: '⛅' },
      3: { type: 'cloudy', description: 'Overcast', icon: '☁️' },
      45: { type: 'fog', description: 'Fog', icon: '🌫️' },
      48: { type: 'fog', description: 'Depositing rime fog', icon: '🌫️' },
      51: { type: 'rain', description: 'Light drizzle', icon: '🌦️' },
      53: { type: 'rain', description: 'Moderate drizzle', icon: '🌧️' },
      55: { type: 'rain', description: 'Dense drizzle', icon: '🌧️' },
      61: { type: 'rain', description: 'Slight rain', icon: '🌦️' },
      63: { type: 'rain', description: 'Moderate rain', icon: '🌧️' },
      65: { type: 'rain', description: 'Heavy rain', icon: '🌧️' },
      71: { type: 'snow', description: 'Slight snow fall', icon: '🌨️' },
      73: { type: 'snow', description: 'Moderate snow fall', icon: '❄️' },
      75: { type: 'snow', description: 'Heavy snow fall', icon: '❄️' },
      80: { type: 'rain', description: 'Slight rain showers', icon: '🌦️' },
      81: { type: 'rain', description: 'Moderate rain showers', icon: '🌧️' },
      82: { type: 'rain', description: 'Violent rain showers', icon: '⛈️' },
      95: { type: 'thunderstorm', description: 'Thunderstorm', icon: '⛈️' },
      96: { type: 'thunderstorm', description: 'Thunderstorm with hail', icon: '⛈️' },
      99: { type: 'thunderstorm', description: 'Thunderstorm with heavy hail', icon: '⛈️' }
    };
    
    return weatherMap[weatherCode] || { type: 'unknown', description: 'Unknown', icon: '❓' };
  };
  
  // Determine if weather is suitable for outdoor activities
  const isOutdoorWeatherSuitable = (weatherData) => {
    if (!weatherData?.current) return false;
    
    const weatherCode = weatherData.current.weather_code;
    const temperature = weatherData.current.temperature_2m;
    const windSpeed = weatherData.current.wind_speed_10m;
    const precipitation = weatherData.current.precipitation || 0;
    
    // Weather is suitable if:
    // - Not heavy rain/snow/storm (weather codes above 65)
    // - Temperature is above 10°C (50°F)
    // - Wind speed is below 25 km/h
    // - No significant precipitation (less than 1mm)
    
    return (
      (weatherCode < 65 || weatherCode === 80) && 
      temperature > 10 && 
      windSpeed < 25 && 
      precipitation < 1
    );
  };
  
  export { fetchWeatherData, getUserLocation, getWeatherDescription, isOutdoorWeatherSuitable };
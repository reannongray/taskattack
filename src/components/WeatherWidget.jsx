import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

// Add a useRef to prevent multiple fetch cycles
function WeatherWidget({ currentTheme, onWeatherUpdate }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);
  const fetchingRef = useRef(false);

  const getUserLocation = async () => {
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
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      console.log(`Fetching weather for lat: ${latitude}, lon: ${longitude}`);
      
      // Request temperature in Fahrenheit by using temperature_unit=fahrenheit parameter
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Weather data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  useEffect(() => {
    // Prevent fetch if already fetching
    if (fetchingRef.current) return;
    
    const loadWeatherData = async () => {
      if (isInitialMount.current || !weather) {
        try {
          fetchingRef.current = true;
          setLoading(true);
          setError(null);
          
          console.log('Getting user location...');
          const location = await getUserLocation();
          console.log('Location acquired:', location);
          
          const data = await fetchWeatherData(location.latitude, location.longitude);
          
          if (data) {
            setWeather(data);
            if (onWeatherUpdate) {
              onWeatherUpdate(data);
            }
          } else {
            throw new Error('No weather data received');
          }
        } catch (err) {
          console.error('Weather loading error:', err);
          setError(err.message || 'Could not load weather data');
        } finally {
          setLoading(false);
          fetchingRef.current = false;
          isInitialMount.current = false;
        }
      }
    };

    loadWeatherData();
    
    // Refresh weather data every 30 minutes instead of constant re-fetching
    const intervalId = setInterval(() => {
      fetchingRef.current = false; // Reset fetching flag for interval updates
      loadWeatherData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [onWeatherUpdate, weather]); // Only re-run if onWeatherUpdate changes

  // Determine what to display based on component state
  if (loading && !weather) {
    return (
      <div className="flex items-center gap-2 text-white/70 animate-pulse">
        <Cloud className="h-5 w-5" />
        <span className="text-sm">Loading weather...</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="flex items-center gap-2 text-white/70">
        <Cloud className="h-5 w-5" />
        <span className="text-sm" title={error}>Weather unavailable</span>
      </div>
    );
  }

  // Safety check - if somehow no weather data still
  if (!weather?.current) {
    return (
      <div className="flex items-center gap-2 text-white/70">
        <Cloud className="h-5 w-5" />
        <span className="text-sm">68°F</span>
      </div>
    );
  }

  const temperature = weather.current.temperature_2m;
  const weatherCode = weather.current.weather_code;
  
  const getWeatherDescription = (code) => {
    const weatherMap = {
      0: { type: 'clear', description: 'Clear sky' },
      1: { type: 'clear', description: 'Mainly clear' },
      2: { type: 'cloudy', description: 'Partly cloudy' },
      3: { type: 'cloudy', description: 'Overcast' },
      45: { type: 'fog', description: 'Fog' },
      48: { type: 'fog', description: 'Depositing rime fog' },
      51: { type: 'rain', description: 'Light drizzle' },
      53: { type: 'rain', description: 'Moderate drizzle' },
      55: { type: 'rain', description: 'Dense drizzle' },
      61: { type: 'rain', description: 'Slight rain' },
      63: { type: 'rain', description: 'Moderate rain' },
      65: { type: 'rain', description: 'Heavy rain' },
      71: { type: 'snow', description: 'Slight snow fall' },
      73: { type: 'snow', description: 'Moderate snow fall' },
      75: { type: 'snow', description: 'Heavy snow fall' },
      80: { type: 'rain', description: 'Slight rain showers' },
      81: { type: 'rain', description: 'Moderate rain showers' },
      82: { type: 'rain', description: 'Violent rain showers' },
      95: { type: 'thunderstorm', description: 'Thunderstorm' },
      96: { type: 'thunderstorm', description: 'Thunderstorm with hail' },
      99: { type: 'thunderstorm', description: 'Thunderstorm with heavy hail' }
    };
    
    return weatherMap[code] || { type: 'unknown', description: 'Unknown' };
  };
  
  // Get weather icon component
  const getWeatherIcon = () => {
    switch (weatherInfo.type) {
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-300" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-300" />;
      case 'rain':
        return <CloudRain className="h-6 w-6 text-blue-300" />;
      case 'snow':
        return <Snowflake className="h-6 w-6 text-blue-100" />;
      case 'thunderstorm':
        return <CloudLightning className="h-6 w-6 text-purple-300" />;
      case 'fog':
        return <Cloud className="h-6 w-6 text-gray-400" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-300" />;
    }
  };

  // Get theme-specific styling
  const getThemeStyles = () => {
    switch (currentTheme) {
      case 'ocean':
        return 'bg-blue-500/20';
      case 'forest':
        return 'bg-green-500/20';
      case 'sunset':
        return 'bg-orange-500/20';
      case 'moonlight':
        return 'bg-indigo-500/20';
      case 'aurora':
        return 'bg-teal-500/20';
      default:
        return 'bg-blue-500/20';
    }
  };

  const weatherInfo = getWeatherDescription(weatherCode);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getThemeStyles()}`}>
      {getWeatherIcon()}
      <div className="flex flex-col">
        <span className="text-white font-medium">
          {Math.round(temperature)}°F
        </span>
        <span className="text-white/70 text-xs">
          {weatherInfo.description}
        </span>
      </div>
    </div>
  );
}

WeatherWidget.propTypes = {
  currentTheme: PropTypes.string.isRequired,
  onWeatherUpdate: PropTypes.func
};

export default WeatherWidget;
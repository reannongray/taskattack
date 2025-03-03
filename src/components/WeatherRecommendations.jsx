// src/components/WeatherRecommendations.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sun, CloudRain, Home } from 'lucide-react';

const isOutdoorWeatherSuitable = (weatherData) => {
  if (!weatherData?.current) return false;
  
  const weatherCode = weatherData.current.weather_code;
  const temperature = weatherData.current.temperature_2m;
  const windSpeed = weatherData.current.wind_speed_10m;
  const precipitation = weatherData.current.precipitation || 0;
  
  return (
    (weatherCode < 65 || weatherCode === 80) && 
    temperature > 10 && 
    windSpeed < 25 && 
    precipitation < 1
  );
};

function WeatherRecommendations({ weather, tasks, theme, onTaskSelect }) {
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    if (!weather || !tasks.length) {
      setRecommendations([]);
      return;
    }
    
    const isOutdoorSuitable = isOutdoorWeatherSuitable(weather);
    
    // Filter tasks based on weather conditions
    const recommendedTasks = tasks.filter(task => {
      if (task.completed) return false;
      
      // If weather is good, recommend outdoor tasks
      if (isOutdoorSuitable && task.location === 'outdoor') {
        return true;
      }
      
      // If weather is bad, recommend indoor tasks
      return !isOutdoorSuitable && task.location === 'indoor';
    }).slice(0, 3); // Limit to 3 recommendations
    
    setRecommendations(recommendedTasks);
  }, [weather, tasks]);
  
  // Return null if no recommendations
  return !recommendations.length ? null : (
    <div className={`${theme.colors} bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-6`}>
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        {isOutdoorWeatherSuitable(weather) ? (
          <>
            <Sun className="h-5 w-5 text-yellow-300" />
            Perfect weather for these tasks:
          </>
        ) : (
          <>
            <CloudRain className="h-5 w-5 text-blue-300" />
            Weather suggests these indoor tasks:
          </>
        )}
      </h3>
      
      <div className="space-y-2">
        {recommendations.map(task => (
          <button
            key={task.id}
            onClick={() => onTaskSelect(task.id)}
            className={`w-full text-left p-3 rounded-lg bg-white/10 
                     hover:bg-white/20 transition-colors flex items-center gap-3`}
          >
            {task.location === 'indoor' ? (
              <Home className="h-4 w-4 text-white/70" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-300" />
            )}
            <span className="text-white">{task.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

WeatherRecommendations.propTypes = {
  weather: PropTypes.object,
  tasks: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  onTaskSelect: PropTypes.func.isRequired
};

export default WeatherRecommendations;
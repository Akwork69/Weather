import { useState, useCallback } from 'react';

const API_KEY = '6a2c12f3b731d80b9e125a301c4e939b';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  main: string;
  visibility: number;
  pressure: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
}

export interface WeatherError {
  message: string;
  code?: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        main: data.weather[0].main,
        visibility: Math.round(data.visibility / 1000), // Convert to km
        pressure: data.main.pressure,
        clouds: data.clouds.all,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        dt: data.dt,
      };

      setWeather(weatherData);
      return weatherData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError({ message: errorMessage });
      setWeather(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weather,
    loading,
    error,
    fetchWeather,
    clearError,
    setWeather,
  };
};

export const getWeatherCondition = (main: string): string => {
  const conditions: Record<string, string> = {
    Clear: 'clear',
    Clouds: 'clouds',
    Rain: 'rain',
    Drizzle: 'rain',
    Thunderstorm: 'storm',
    Snow: 'snow',
    Mist: 'fog',
    Fog: 'fog',
    Haze: 'fog',
    Smoke: 'fog',
    Dust: 'fog',
    Sand: 'fog',
    Ash: 'fog',
    Squall: 'storm',
    Tornado: 'storm',
  };
  return conditions[main] || 'clear';
};

export const isNightTime = (weather: WeatherData): boolean => {
  const currentTime = weather.dt;
  return currentTime < weather.sunrise || currentTime > weather.sunset;
};

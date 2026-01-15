import { useState, useCallback, useEffect } from 'react';
import type { WeatherData } from './useWeather';

const FAVORITES_KEY = 'weather_favorites';
const RECENT_KEY = 'weather_recent';
const HISTORY_KEY = 'weather_history';

interface WeatherHistoryItem {
  city: string;
  weather: WeatherData;
  timestamp: number;
}

export const useWeatherStorage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [weatherHistory, setWeatherHistory] = useState<WeatherHistoryItem[]>([]);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = sessionStorage.getItem(FAVORITES_KEY);
      const savedRecent = sessionStorage.getItem(RECENT_KEY);
      const savedHistory = sessionStorage.getItem(HISTORY_KEY);

      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedRecent) setRecentSearches(JSON.parse(savedRecent));
      if (savedHistory) setWeatherHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Error loading weather storage:', error);
    }
  }, []);

  // Save favorites
  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  // Add to favorites
  const addFavorite = useCallback((city: string) => {
    setFavorites(prev => {
      if (prev.includes(city)) return prev;
      const newFavorites = [...prev, city].slice(0, 10); // Max 10 favorites
      sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((city: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f !== city);
      sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((city: string) => {
    if (favorites.includes(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Add recent search
  const addRecentSearch = useCallback((city: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== city.toLowerCase());
      const newRecent = [city, ...filtered].slice(0, 5); // Max 5 recent
      sessionStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    sessionStorage.removeItem(RECENT_KEY);
  }, []);

  // Add to weather history
  const addToHistory = useCallback((weather: WeatherData) => {
    setWeatherHistory(prev => {
      const newItem: WeatherHistoryItem = {
        city: weather.city,
        weather,
        timestamp: Date.now(),
      };
      const newHistory = [newItem, ...prev].slice(0, 20); // Max 20 history items
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setWeatherHistory([]);
    sessionStorage.removeItem(HISTORY_KEY);
  }, []);

  // Check if city is favorite
  const isFavorite = useCallback((city: string) => {
    return favorites.some(f => f.toLowerCase() === city.toLowerCase());
  }, [favorites]);

  return {
    favorites,
    recentSearches,
    weatherHistory,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    addRecentSearch,
    clearRecentSearches,
    addToHistory,
    clearHistory,
  };
};

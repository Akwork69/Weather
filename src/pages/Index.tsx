import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { useWeatherStorage } from '@/hooks/useWeatherStorage';
import AtmosphericBackground from '@/components/weather/AtmosphericBackground';
import WeatherParticles from '@/components/weather/WeatherParticles';
import CitySearch from '@/components/weather/CitySearch';
import WeatherDisplay from '@/components/weather/WeatherDisplay';
import IndianCitiesCarousel from '@/components/weather/IndianCitiesCarousel';
import WeatherAlerts from '@/components/weather/WeatherAlerts';
import ErrorState from '@/components/weather/ErrorState';
import WelcomeState from '@/components/weather/WelcomeState';

const Index = () => {
  const { weather, loading, error, fetchWeather, clearError } = useWeather();
  const { mousePosition, getParallaxStyle } = useMouseParallax(0.03);
  const {
    favorites,
    recentSearches,
    toggleFavorite,
    isFavorite,
    addRecentSearch,
    addToHistory,
  } = useWeatherStorage();

  const [hasInteracted, setHasInteracted] = useState(false);

  // Handle city search
  const handleSearch = useCallback(async (city: string) => {
    setHasInteracted(true);
    clearError();
    const result = await fetchWeather(city);
    if (result) {
      addRecentSearch(city);
      addToHistory(result);
    }
  }, [fetchWeather, clearError, addRecentSearch, addToHistory]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(() => {
    if (weather) {
      toggleFavorite(weather.city);
    }
  }, [weather, toggleFavorite]);

  // Auto-fetch first city from carousel on mount
  useEffect(() => {
    // Slight delay to ensure smooth initial render
    const timer = setTimeout(() => {
      handleSearch('Mumbai');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Atmospheric Background */}
      <AtmosphericBackground
        weather={weather}
        mouseX={mousePosition.x}
        mouseY={mousePosition.y}
      />

      {/* Weather Particles */}
      <WeatherParticles weather={weather} />

      {/* Weather Alerts */}
      <WeatherAlerts weather={weather} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header / Search */}
        <motion.header
          className="pt-8 pb-4 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="text-center mb-6"
            style={getParallaxStyle(0.5)}
          >
            <h1 className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-1">
              Weather Experience
            </h1>
          </motion.div>
          
          <CitySearch
            onSearch={handleSearch}
            recentSearches={recentSearches}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            loading={loading}
          />
        </motion.header>

        {/* Main Weather Display */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {error ? (
                <ErrorState
                  key="error"
                  message={error.message}
                  onRetry={() => weather && handleSearch(weather.city)}
                />
              ) : weather ? (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <WeatherDisplay
                    weather={weather}
                    isFavorite={isFavorite(weather.city)}
                    onToggleFavorite={handleToggleFavorite}
                    mouseX={mousePosition.x}
                    mouseY={mousePosition.y}
                  />
                </motion.div>
              ) : !hasInteracted ? (
                <WelcomeState key="welcome" />
              ) : null}
            </AnimatePresence>
          </div>
        </main>

        {/* Indian Cities Carousel */}
        <motion.footer
          className="pb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <IndianCitiesCarousel
            onSelectCity={handleSearch}
            selectedCity={weather?.city}
          />
        </motion.footer>
      </div>

      {/* Cinematic vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
};

export default Index;

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Wind, ChevronLeft, ChevronRight } from 'lucide-react';

const API_KEY = '6a2c12f3b731d80b9e125a301c4e939b';

interface CityWeather {
  city: string;
  temp: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
  main: string;
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Kanpur', 'Nagpur', 'Patna', 'Indore'
];

const weatherEmojis: Record<string, string> = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
};

interface IndianCitiesCarouselProps {
  onSelectCity: (city: string) => void;
  selectedCity?: string;
}

const IndianCitiesCarousel = ({ onSelectCity, selectedCity }: IndianCitiesCarouselProps) => {
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchAllCitiesWeather = async () => {
      setLoading(true);
      const weatherData: CityWeather[] = [];

      for (const city of INDIAN_CITIES) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`
          );
          if (response.ok) {
            const data = await response.json();
            weatherData.push({
              city: data.name,
              temp: Math.round(data.main.temp),
              humidity: data.main.humidity,
              wind: Math.round(data.wind.speed * 3.6),
              description: data.weather[0].description,
              icon: data.weather[0].icon,
              main: data.weather[0].main,
            });
          }
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error);
        }
      }

      setCitiesWeather(weatherData);
      setLoading(false);
    };

    fetchAllCitiesWeather();
  }, []);

  const checkScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons);
    }
  }, [checkScrollButtons, citiesWeather]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex gap-4 px-6 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="glass-card p-4 min-w-[180px] animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded mb-3 w-20" />
              <div className="h-10 bg-white/10 rounded mb-2" />
              <div className="h-3 bg-white/10 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 relative">
      {/* Section header */}
      <motion.div 
        className="flex items-center justify-between px-6 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-display font-medium">Explore India</h3>
        </div>
        <p className="text-sm text-muted-foreground">Drag to explore</p>
      </motion.div>

      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-2 top-1/2 translate-y-2 z-20 p-2 glass-card rounded-full transition-all duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className={`absolute right-2 top-1/2 translate-y-2 z-20 p-2 glass-card rounded-full transition-all duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-6 overflow-x-auto scrollbar-thin pb-4 cursor-grab active:cursor-grabbing"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {citiesWeather.map((cityData, index) => (
          <motion.button
            key={cityData.city}
            onClick={() => onSelectCity(cityData.city)}
            className={`carousel-item flex-shrink-0 text-left ${
              selectedCity === cityData.city ? 'ring-2 ring-primary' : ''
            }`}
            style={{ scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-sm">{cityData.city}</p>
                <p className="text-xs text-muted-foreground capitalize">{cityData.description}</p>
              </div>
              <span className="text-2xl">
                {weatherEmojis[cityData.main] || '🌤️'}
              </span>
            </div>
            
            <div className="text-3xl font-display font-light mb-3">
              {cityData.temp}°
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{cityData.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{cityData.wind}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default IndianCitiesCarousel;

import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Cloud,
  Star,
  Sunrise,
  Sunset
} from 'lucide-react';
import type { WeatherData } from '@/hooks/useWeather';
import { isNightTime } from '@/hooks/useWeather';

interface WeatherDisplayProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  mouseX?: number;
  mouseY?: number;
}

const WeatherDisplay = ({ 
  weather, 
  isFavorite, 
  onToggleFavorite,
  mouseX = 0,
  mouseY = 0,
}: WeatherDisplayProps) => {
  const isNight = isNightTime(weather);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const weatherIcons: Record<string, string> = {
    Clear: isNight ? '🌙' : '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="relative z-10 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        transform: `translate(${mouseX * -0.01}px, ${mouseY * -0.01}px)`,
      }}
    >
      {/* Location & Favorite */}
      <motion.div 
        className="flex items-center justify-center gap-3 mb-4"
        variants={itemVariants}
      >
        <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground/90">
          {weather.city}, {weather.country}
        </h2>
        <motion.button
          onClick={onToggleFavorite}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Star 
            className={`w-6 h-6 transition-all duration-300 ${
              isFavorite 
                ? 'fill-primary text-primary' 
                : 'text-muted-foreground hover:text-primary'
            }`} 
          />
        </motion.button>
      </motion.div>

      {/* Weather Icon & Temp */}
      <motion.div 
        className="flex flex-col items-center mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="text-[100px] md:text-[140px] leading-none select-none mb-4"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
          }}
        >
          {weatherIcons[weather.main] || '🌤️'}
        </motion.div>
        
        <motion.div 
          className="text-cinematic"
          style={{
            fontSize: 'clamp(5rem, 18vw, 12rem)',
            fontWeight: 200,
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '-0.05em',
            lineHeight: 0.9,
          }}
        >
          {weather.temp}°
        </motion.div>
      </motion.div>

      {/* Description */}
      <motion.p 
        className="text-xl md:text-2xl capitalize text-muted-foreground mb-2"
        variants={itemVariants}
      >
        {weather.description}
      </motion.p>

      {/* Feels like */}
      <motion.p
        className="text-sm text-muted-foreground/70 mb-8"
        variants={itemVariants}
      >
        Feels like {weather.feels_like}°C
      </motion.p>

      {/* Sunrise/Sunset */}
      <motion.div 
        className="flex items-center justify-center gap-8 mb-10"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sunrise className="w-5 h-5 text-weather-clear" />
          <span className="text-sm">{formatTime(weather.sunrise)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sunset className="w-5 h-5 text-weather-clear-dark" />
          <span className="text-sm">{formatTime(weather.sunset)}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
        variants={itemVariants}
      >
        {[
          { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%`, color: 'text-weather-rain' },
          { icon: Wind, label: 'Wind', value: `${weather.wind_speed} km/h`, color: 'text-accent' },
          { icon: Eye, label: 'Visibility', value: `${weather.visibility} km`, color: 'text-muted-foreground' },
          { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa`, color: 'text-muted-foreground' },
          { icon: Cloud, label: 'Clouds', value: `${weather.clouds}%`, color: 'text-weather-fog' },
          { icon: Thermometer, label: 'Feels', value: `${weather.feels_like}°C`, color: 'text-weather-clear' },
        ].map(({ icon: Icon, label, value, color }) => (
          <motion.div
            key={label}
            className="glass-card p-4 group cursor-default"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <Icon className={`w-5 h-5 ${color} mb-2 mx-auto group-hover:scale-110 transition-transform`} />
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-lg font-medium">{value}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WeatherDisplay;

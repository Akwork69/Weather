import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { WeatherData } from '@/hooks/useWeather';
import { getWeatherCondition, isNightTime } from '@/hooks/useWeather';

interface AtmosphericBackgroundProps {
  weather: WeatherData | null;
  mouseX?: number;
  mouseY?: number;
}

const AtmosphericBackground = ({ weather, mouseX = 0, mouseY = 0 }: AtmosphericBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const isNight = weather ? isNightTime(weather) : false;
  const condition = weather ? getWeatherCondition(weather.main) : 'clear';

  const gradientColors = useMemo(() => {
    if (isNight) {
      switch (condition) {
        case 'storm':
          return ['#0a0a1a', '#1a1a3a', '#2a1a4a'];
        case 'rain':
          return ['#0d1b2a', '#1b263b', '#2d3748'];
        case 'snow':
          return ['#1a1a2e', '#2d2d44', '#3d3d5c'];
        case 'fog':
          return ['#1a1a1a', '#2a2a2a', '#3a3a3a'];
        case 'clouds':
          return ['#0f1624', '#1a2332', '#253040'];
        default:
          return ['#0a0a1f', '#141428', '#1e1e32'];
      }
    } else {
      switch (condition) {
        case 'storm':
          return ['#2d3436', '#4a5568', '#5a6778'];
        case 'rain':
          return ['#3d5a80', '#4a6fa5', '#5b7fb5'];
        case 'snow':
          return ['#94a3b8', '#b4c5d4', '#d4e5f4'];
        case 'fog':
          return ['#94a3b8', '#a8b8c8', '#c8d8e8'];
        case 'clouds':
          return ['#4a90a4', '#5ba0b4', '#6cb0c4'];
        default:
          return ['#38bdf8', '#60a5fa', '#818cf8'];
      }
    }
  }, [condition, isNight]);

  // Stars for night sky
  const stars = useMemo(() => {
    if (!isNight) return [];
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
    }));
  }, [isNight]);

  // Clouds layer
  const clouds = useMemo(() => {
    if (condition !== 'clouds' && condition !== 'rain' && condition !== 'storm') return [];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: i * 25,
      y: Math.random() * 30 + 5,
      scale: Math.random() * 0.5 + 0.8,
      opacity: isNight ? 0.15 : 0.25,
      duration: Math.random() * 40 + 60,
    }));
  }, [condition, isNight]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <motion.div
        className="absolute inset-0 transition-all duration-3000 ease-cinematic"
        style={{
          background: `linear-gradient(180deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 50%, ${gradientColors[2]} 100%)`,
        }}
        animate={{
          background: `linear-gradient(180deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 50%, ${gradientColors[2]} 100%)`,
        }}
        transition={{ duration: 3 }}
      />

      {/* Parallax atmospheric layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          transform: `translate(${mouseX * 0.02}px, ${mouseY * 0.02}px)`,
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: isNight 
              ? 'radial-gradient(circle, rgba(100, 149, 237, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
            top: isNight ? '10%' : '5%',
            left: isNight ? '60%' : '30%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>

      {/* Stars layer (night only) */}
      {isNight && (
        <div className="absolute inset-0">
          {stars.map(star => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              }}
              animate={{
                opacity: [star.opacity, star.opacity * 1.5, star.opacity],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Moon (night) / Sun (day) */}
      <motion.div
        className="absolute"
        style={{
          top: isNight ? '8%' : '5%',
          right: isNight ? '15%' : '20%',
          transform: `translate(${mouseX * -0.03}px, ${mouseY * -0.03}px)`,
        }}
      >
        {isNight ? (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 glow-moon" />
            <div className="absolute inset-0 w-24 h-24 rounded-full opacity-50" 
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.3) 0%, transparent 50%)',
              }}
            />
          </div>
        ) : (
          condition === 'clear' && (
            <div className="relative">
              <motion.div 
                className="w-32 h-32 rounded-full glow-sun"
                style={{
                  background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          )
        )}
      </motion.div>

      {/* Cloud layers */}
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            top: `${cloud.y}%`,
          }}
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: "linear",
            delay: cloud.id * 5,
          }}
        >
          <svg
            width="300"
            height="100"
            viewBox="0 0 300 100"
            style={{
              transform: `scale(${cloud.scale})`,
              opacity: cloud.opacity,
            }}
          >
            <ellipse cx="100" cy="60" rx="80" ry="40" fill="white" />
            <ellipse cx="160" cy="50" rx="70" ry="45" fill="white" />
            <ellipse cx="210" cy="60" rx="60" ry="35" fill="white" />
            <ellipse cx="130" cy="45" rx="50" ry="30" fill="white" />
          </svg>
        </motion.div>
      ))}

      {/* Fog effect */}
      {condition === 'fog' && (
        <>
          <motion.div
            className="absolute inset-0 animate-fog"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(200,200,200,0.2) 50%, transparent 100%)',
            }}
          />
          <motion.div
            className="absolute inset-0 animate-fog"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(200,200,200,0.15) 50%, transparent 100%)',
              animationDelay: '10s',
            }}
          />
        </>
      )}

      {/* Volumetric light beams */}
      {!isNight && condition === 'clear' && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-[20%] w-[400px] h-[600px] light-beam"
            style={{
              transform: `rotate(15deg) translate(${mouseX * 0.01}px, ${mouseY * 0.01}px)`,
              transformOrigin: 'top center',
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
};

export default AtmosphericBackground;

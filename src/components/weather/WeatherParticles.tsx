import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { WeatherData } from '@/hooks/useWeather';
import { getWeatherCondition } from '@/hooks/useWeather';

interface WeatherParticlesProps {
  weather: WeatherData | null;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const WeatherParticles = ({ weather }: WeatherParticlesProps) => {
  const condition = weather ? getWeatherCondition(weather.main) : null;
  const windSpeed = weather?.wind_speed || 0;
  
  // Generate rain particles
  const rainParticles: Particle[] = useMemo(() => {
    if (condition !== 'rain' && condition !== 'storm') return [];
    const count = condition === 'storm' ? 150 : 100;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 0.8 + 0.6,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, [condition]);

  // Generate snow particles
  const snowParticles: Particle[] = useMemo(() => {
    if (condition !== 'snow') return [];
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -5,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.4,
    }));
  }, [condition]);

  // Lightning flashes
  const showLightning = condition === 'storm';

  return (
    <div className="particles-container">
      {/* Rain */}
      {rainParticles.map(particle => (
        <motion.div
          key={`rain-${particle.id}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size * 15,
            background: 'linear-gradient(180deg, transparent 0%, rgba(100, 149, 237, 0.8) 50%, rgba(100, 149, 237, 0.4) 100%)',
            opacity: particle.opacity,
          }}
          initial={{ y: '-10vh', x: 0 }}
          animate={{
            y: '110vh',
            x: windSpeed * 2,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Snow */}
      {snowParticles.map(particle => (
        <motion.div
          key={`snow-${particle.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            filter: 'blur(1px)',
          }}
          initial={{ y: '-5vh', x: 0, rotate: 0 }}
          animate={{
            y: '105vh',
            x: [0, 30, -20, 40, 0],
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: particle.duration * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />
      ))}

      {/* Lightning */}
      {showLightning && (
        <>
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none"
            animate={{
              opacity: [0, 0, 0, 0, 0.8, 0, 0.3, 0, 0, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 3,
            }}
          />
          <motion.svg
            className="absolute top-0 left-1/3 w-40 h-96 pointer-events-none"
            viewBox="0 0 100 300"
            animate={{
              opacity: [0, 0, 0, 0, 1, 0, 0.5, 0, 0, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: Math.random() * 6 + 4,
            }}
          >
            <path
              d="M50 0 L45 80 L60 85 L40 150 L55 155 L30 250 L70 140 L50 135 L75 70 L55 65 Z"
              fill="rgba(255, 255, 255, 0.9)"
              filter="url(#lightning-glow)"
            />
            <defs>
              <filter id="lightning-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </motion.svg>
        </>
      )}

      {/* Wind streaks */}
      {windSpeed > 20 && (
        <>
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={`wind-${i}`}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 100}px`,
              }}
              initial={{ x: '-200px', opacity: 0 }}
              animate={{ x: '100vw', opacity: [0, 0.5, 0] }}
              transition={{
                duration: Math.random() * 1 + 0.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default WeatherParticles;

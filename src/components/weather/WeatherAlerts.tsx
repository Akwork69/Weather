import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wind, Thermometer, Eye, CloudRain, Snowflake } from 'lucide-react';
import type { WeatherData } from '@/hooks/useWeather';

interface WeatherAlertsProps {
  weather: WeatherData | null;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WeatherAlerts = ({ weather }: WeatherAlertsProps) => {
  const alerts = useMemo<Alert[]>(() => {
    if (!weather) return [];
    
    const alertList: Alert[] = [];

    // High wind alert
    if (weather.wind_speed > 50) {
      alertList.push({
        id: 'wind-danger',
        type: 'danger',
        icon: <Wind className="w-5 h-5" />,
        title: 'Severe Wind Warning',
        description: `Wind speeds of ${weather.wind_speed} km/h. Stay indoors if possible.`,
      });
    } else if (weather.wind_speed > 30) {
      alertList.push({
        id: 'wind-warning',
        type: 'warning',
        icon: <Wind className="w-5 h-5" />,
        title: 'High Wind Advisory',
        description: `Gusty winds at ${weather.wind_speed} km/h expected.`,
      });
    }

    // Extreme heat
    if (weather.temp > 40) {
      alertList.push({
        id: 'heat-danger',
        type: 'danger',
        icon: <Thermometer className="w-5 h-5" />,
        title: 'Extreme Heat Warning',
        description: 'Dangerous heat levels. Stay hydrated and avoid outdoor activities.',
      });
    } else if (weather.temp > 35) {
      alertList.push({
        id: 'heat-warning',
        type: 'warning',
        icon: <Thermometer className="w-5 h-5" />,
        title: 'Heat Advisory',
        description: 'High temperatures expected. Take precautions.',
      });
    }

    // Extreme cold
    if (weather.temp < 0) {
      alertList.push({
        id: 'cold-danger',
        type: 'danger',
        icon: <Snowflake className="w-5 h-5" />,
        title: 'Freeze Warning',
        description: 'Sub-zero temperatures. Protect exposed skin and pipes.',
      });
    } else if (weather.temp < 5) {
      alertList.push({
        id: 'cold-warning',
        type: 'warning',
        icon: <Snowflake className="w-5 h-5" />,
        title: 'Cold Weather Advisory',
        description: 'Near-freezing temperatures expected.',
      });
    }

    // Low visibility
    if (weather.visibility < 1) {
      alertList.push({
        id: 'visibility-danger',
        type: 'danger',
        icon: <Eye className="w-5 h-5" />,
        title: 'Dense Fog Warning',
        description: 'Very low visibility. Avoid driving if possible.',
      });
    } else if (weather.visibility < 3) {
      alertList.push({
        id: 'visibility-warning',
        type: 'warning',
        icon: <Eye className="w-5 h-5" />,
        title: 'Fog Advisory',
        description: 'Reduced visibility conditions.',
      });
    }

    // Storm warning
    if (weather.main === 'Thunderstorm') {
      alertList.push({
        id: 'storm-warning',
        type: 'danger',
        icon: <CloudRain className="w-5 h-5" />,
        title: 'Thunderstorm Warning',
        description: 'Active thunderstorm in your area. Seek shelter immediately.',
      });
    }

    return alertList;
  }, [weather]);

  if (alerts.length === 0) return null;

  const typeStyles = {
    danger: 'bg-destructive/20 border-destructive/50 text-destructive',
    warning: 'bg-weather-clear/20 border-weather-clear/50 text-weather-clear',
    info: 'bg-accent/20 border-accent/50 text-accent',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 border ${typeStyles[alert.type]} flex items-start gap-3`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="font-medium text-sm">{alert.title}</p>
                </div>
                <p className="text-xs opacity-80">{alert.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherAlerts;

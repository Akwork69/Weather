import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

const WelcomeState = () => {
  const floatingIcons = [
    { icon: Sun, delay: 0, x: -150, y: -80 },
    { icon: Cloud, delay: 0.2, x: 150, y: -60 },
    { icon: CloudRain, delay: 0.4, x: -120, y: 60 },
    { icon: Snowflake, delay: 0.6, x: 180, y: 40 },
    { icon: Wind, delay: 0.8, x: 0, y: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative text-center py-12"
    >
      {/* Floating weather icons */}
      <div className="relative h-48 mb-8">
        {floatingIcons.map(({ icon: Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.3,
              scale: 1,
              x: x,
              y: y,
            }}
            transition={{
              delay: delay,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-12 h-12 text-muted-foreground" />
            </motion.div>
          </motion.div>
        ))}
        
        {/* Central glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.h1
        className="text-4xl md:text-6xl font-display font-light mb-4 text-cinematic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Feel the Weather
      </motion.h1>
      
      <motion.p
        className="text-lg text-muted-foreground max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Search for any city above to immerse yourself in its atmosphere
      </motion.p>

      {/* Decorative line */}
      <motion.div
        className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
      />
    </motion.div>
  );
};

export default WelcomeState;

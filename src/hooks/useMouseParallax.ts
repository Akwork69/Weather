import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export const useMouseParallax = (sensitivity: number = 0.05) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  
  const targetRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    targetRef.current = {
      x: (clientX - innerWidth / 2) * sensitivity,
      y: (clientY - innerHeight / 2) * sensitivity,
    };
  }, [sensitivity]);

  useEffect(() => {
    const animate = () => {
      setMousePosition(prev => {
        const newX = prev.x + (targetRef.current.x - prev.x) * 0.1;
        const newY = prev.y + (targetRef.current.y - prev.y) * 0.1;
        
        return {
          x: newX,
          y: newY,
          normalizedX: newX / (window.innerWidth * sensitivity / 2),
          normalizedY: newY / (window.innerHeight * sensitivity / 2),
        };
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, sensitivity]);

  const getParallaxStyle = useCallback((depth: number = 1) => ({
    transform: `translate(${mousePosition.x * depth}px, ${mousePosition.y * depth}px)`,
  }), [mousePosition]);

  return {
    mousePosition,
    getParallaxStyle,
  };
};

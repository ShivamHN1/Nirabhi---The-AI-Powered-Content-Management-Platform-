import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(0);
  const stepDuration = 20; // ms

  useEffect(() => {
    ref.current = 0;
    const accumulator = value / (500 / stepDuration); // Animate over ~500ms
    
    const updateCounter = () => {
      if (ref.current < value) {
        ref.current = Math.min(ref.current + accumulator, value);
        setCount(Math.ceil(ref.current));
        setTimeout(updateCounter, stepDuration);
      } else {
        setCount(value);
      }
    };

    if (value > 0) {
      updateCounter();
    } else {
      setCount(0);
    }
  }, [value]);

  return <span className={className}>{count}</span>;
};

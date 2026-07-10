import { useEffect, useState } from "react";

function AnimatedNumber({ value = 0, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const frameDuration = 20;
    const increment = value / (duration / frameDuration);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        start = value;
        clearInterval(timer);
      }

      setDisplayValue(Math.round(start));
    }, frameDuration);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

export default AnimatedNumber;
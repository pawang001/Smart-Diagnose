import { useState, useEffect } from 'react';

// This custom hook provides a reactive way to get the window size.
// It's a common pattern in React to extract reusable logic like this.
export function UseWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add the event listener when the component mounts
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove the event listener when the component unmounts.
    // This is a crucial cleanup step to prevent memory leaks.
    return () => window.removeEventListener('resize', handleResize);
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return windowSize;
}

import { useEffect, useState } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
    null,
  );
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we're at the top of the page
      setIsAtTop(currentScrollY < 10);

      // Determine scroll direction
      if (currentScrollY > prevScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < prevScrollY) {
        setScrollDirection('up');
      }

      setPrevScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  return { scrollDirection, currentScrollPosition: prevScrollY, isAtTop };
}

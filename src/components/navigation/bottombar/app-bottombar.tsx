import React, { useRef, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AddTransaction } from '@/features/add-transaction';
import { PRIMARY_NAV } from '../constants';
import { NavItem } from './nav-item';

export const AppBottomBar = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollSpeedRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());

  React.useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;

      // Calculate scroll speed (pixels per millisecond)
      const timeDiff = currentTime - lastScrollTimeRef.current;
      const distanceDiff = Math.abs(currentScrollY - lastScrollY.current);
      const scrollSpeed = timeDiff > 0 ? distanceDiff / timeDiff : 0;

      // Set scroll speed reference
      scrollSpeedRef.current = scrollSpeed;

      // Check if at the top of the page
      const isAtTop = currentScrollY === 0;

      // Determine visibility based on scroll direction, speed, and page position
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(scrollSpeed > 0.5 || isAtTop);
      }

      // Update references
      lastScrollY.current = currentScrollY;
      lastScrollTimeRef.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-8 left-1/2 w-3/4 -translate-x-1/2 z-50 block md:hidden transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      id="app-bottom-bar"
    >
      <nav className="flex items-center justify-between rounded-full bg-zinc-800 dark:bg-zinc-900 dark:border dark:border-zinc-900 p-2 shadow-lg">
        {PRIMARY_NAV.slice(0, -1).map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.path}>
              <NavItem
                icon={<Icon />}
                isActive={location.pathname === item.path}
                label={item.label}
                onClick={() => navigate(item.path)}
              />
              {index === 1 && <AddTransaction />}
            </React.Fragment>
          );
        })}
        <NavItem
          icon={<Settings2 />}
          isActive={location.pathname.includes(
            PRIMARY_NAV[PRIMARY_NAV.length - 1].path,
          )}
          label={PRIMARY_NAV[PRIMARY_NAV.length - 1].label}
          onClick={() => navigate(PRIMARY_NAV[PRIMARY_NAV.length - 1].path)}
        />
      </nav>
    </div>
  );
};

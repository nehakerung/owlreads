import React from 'react';
import Log from '@/components/user/log';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { MdDarkMode } from 'react-icons/md';
import { MdLightMode } from 'react-icons/md';

interface Props {
  mobile?: boolean;
}

const NavItems = ({ mobile }: Props) => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeContext must be used within ThemeProvider');
  }

  const { darkMode, toggleTheme } = context;
  return (
    <div
      className={cn(
        `flex items-center justify-center gap-6 ${
          mobile ? 'flex-col' : 'flex-row'
        }`
      )}
    >
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-white text-black dark:bg-black dark:text-white transition flex items-center justify-center"
      >
        {darkMode ? <MdLightMode /> : <MdDarkMode />}
      </button>
      <Log />
    </div>
  );
};

export default NavItems;

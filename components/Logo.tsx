import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", variant = 'color' }) => {
  const primaryColor = variant === 'light' ? '#ffffff' : '#4f46e5'; // Indigo-600
  const secondaryColor = variant === 'light' ? '#e0e7ff' : '#4338ca'; // Indigo-700
  const accentColor = variant === 'light' ? '#fbbf24' : '#f59e0b'; // Amber-500

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
    >
      {/* Background shape mimicking a coin or shield */}
      <circle cx="50" cy="50" r="45" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="4" />
      
      {/* Graduation Cap Style Top */}
      <path 
        d="M20 45 L50 30 L80 45 L50 60 Z" 
        fill={primaryColor} 
        stroke={primaryColor} 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      
      {/* Tassel */}
      <path 
        d="M80 45 V55" 
        stroke={accentColor} 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      <circle cx="80" cy="58" r="3" fill={accentColor} />

      {/* Financial Bar Graph / Book spine Look */}
      <path d="M35 60 V75" stroke={secondaryColor} strokeWidth="6" strokeLinecap="round" />
      <path d="M50 60 V70" stroke={secondaryColor} strokeWidth="6" strokeLinecap="round" />
      <path d="M65 60 V75" stroke={secondaryColor} strokeWidth="6" strokeLinecap="round" />

      {/* S shape Overlay */}
      <path 
        d="M35 50 C 35 40, 65 40, 65 30" 
        stroke={accentColor} 
        strokeWidth="0"
        fill="none"
      />
    </svg>
  );
};

export default Logo;

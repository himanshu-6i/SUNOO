import React from 'react';

export const SunooLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
    <g strokeLinecap="round" strokeWidth="10">
      <line x1="22" y1="35" x2="22" y2="65" stroke="#A926A3" />
      <line x1="36" y1="28" x2="36" y2="72" stroke="#DF1577" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="#FF1053" />
      <line x1="64" y1="28" x2="64" y2="72" stroke="#FF473A" />
      <line x1="78" y1="35" x2="78" y2="65" stroke="#FF8B21" />
    </g>
  </svg>
);

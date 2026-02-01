
import React from 'react';

export const SarcLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <img 
    src="https://raw.githubusercontent.com/bbhatt-git/IdCardGenerator/refs/heads/main/public/sarc.png" 
    alt="Institution Logo" 
    crossOrigin="anonymous"
    className={`object-contain ${className}`} 
  />
);

export const QALogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img 
    src="https://raw.githubusercontent.com/bbhatt-git/IdCardGenerator/refs/heads/main/public/qa.png" 
    alt="QwickAttend Logo" 
    crossOrigin="anonymous"
    className={`object-contain ${className}`} 
  />
);

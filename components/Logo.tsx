
import React from 'react';

export const SarcLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <img 
    src="public/sarc.png" 
    alt="Institution Logo" 
    className={`object-contain ${className}`} 
  />
);

export const QALogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img 
    src="public/qa.png" 
    alt="QwickAttend Logo" 
    className={`object-contain ${className}`} 
  />
);

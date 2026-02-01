
import React from 'react';

export const SarcLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <img 
    src="/sarc.png" 
    alt="Institution Logo" 
    className={`object-contain ${className}`} 
  />
);

export const QALogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img 
    src="/qa.png" 
    alt="QwickAttend Logo" 
    className={`object-contain ${className}`} 
  />
);

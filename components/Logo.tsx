
import React, { useEffect, useState } from 'react';

// Hook to load image as Base64 to bypass CORS issues in canvas/PDF generation
const useImageBase64 = (url: string) => {
  const [dataSrc, setDataSrc] = useState<string>('');

  useEffect(() => {
    // If it's already a data URL, use it directly
    if (url.startsWith('data:')) {
      setDataSrc(url);
      return;
    }

    let active = true;
    const load = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && typeof reader.result === 'string') {
            setDataSrc(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error("Failed to load image", url, e);
        // Fallback if fetch fails
        if (active) setDataSrc(url);
      }
    };
    load();
    return () => { active = false; };
  }, [url]);

  return dataSrc;
};

export const RemoteImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const base64 = useImageBase64(src);
  
  // Render a placeholder or the original source while loading
  if (!base64 && !src) return <div className={`bg-transparent ${className}`} />; 
  
  return (
    <img 
      src={base64 || src} 
      alt={alt} 
      className={`object-contain ${className}`} 
    />
  );
};

export const SarcLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <RemoteImage 
    src="https://raw.githubusercontent.com/bbhatt-git/IdCardGenerator/refs/heads/main/public/sarc.png" 
    alt="Institution Logo" 
    className={className} 
  />
);

export const QALogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <RemoteImage 
    src="https://raw.githubusercontent.com/bbhatt-git/IdCardGenerator/refs/heads/main/public/qa.png" 
    alt="QwickAttend Logo" 
    className={className} 
  />
);

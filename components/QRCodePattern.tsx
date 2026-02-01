
import React, { useMemo } from 'react';
import qrcode from 'qrcode-generator';

interface QRCodePatternProps {
  value: string;
  size?: number;
  color?: string;
}

const QRCodePattern: React.FC<QRCodePatternProps> = ({ value, size = 140, color = "#000000" }) => {
  const modules = useMemo(() => {
    try {
      // Type 0 = Auto detect version, 'H' = High Error Correction
      const qr = qrcode(0, 'H');
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      const result: boolean[][] = [];
      for (let r = 0; r < count; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < count; c++) {
          row.push(qr.isDark(r, c));
        }
        result.push(row);
      }
      return result;
    } catch (e) {
      console.error("QR Generation Error", e);
      return [];
    }
  }, [value]);

  if (modules.length === 0) return null;

  const count = modules.length;
  
  // Helper to check if a module is part of the 7x7 finder patterns in the corners
  const isFinder = (r: number, c: number) => {
    return (r < 7 && c < 7) || // Top-Left
           (r < 7 && c >= count - 7) || // Top-Right
           (r >= count - 7 && c < 7); // Bottom-Left
  };

  const dots = [];
  
  modules.forEach((row, r) => {
    row.forEach((isDark, c) => {
      if (isFinder(r, c)) return; // Don't render standard dots in finder areas
      if (isDark) {
        dots.push(
          <circle 
            key={`${r}-${c}`} 
            cx={c + 0.5} 
            cy={r + 0.5} 
            r={0.4} // Radius 0.4 creates distinct separated dots
            fill={color} 
          />
        );
      }
    });
  });

  // Coordinates for the 3 finder patterns
  const finderLocations = [
    { x: 0, y: 0 },
    { x: count - 7, y: 0 },
    { x: 0, y: count - 7 }
  ];

  return (
    <svg viewBox={`0 0 ${count} ${count}`} width={size} height={size} shapeRendering="geometricPrecision">
      {/* Render the data dots */}
      {dots}
      
      {/* Render custom styled Finder Patterns (Eyes) */}
      {finderLocations.map((loc, i) => (
        <g key={i} transform={`translate(${loc.x}, ${loc.y})`}>
          {/* Outer Frame: Rounded Square */}
          <rect 
            x="0.5" y="0.5" 
            width="6" height="6" 
            rx="1.5" ry="1.5" 
            fill="none" 
            stroke={color} 
            strokeWidth="1" 
          />
          {/* Inner Eye: Rounded Square/Dot */}
          <rect 
            x="2" y="2" 
            width="3" height="3" 
            rx="1" ry="1" 
            fill={color} 
          />
        </g>
      ))}
    </svg>
  );
};

export default QRCodePattern;

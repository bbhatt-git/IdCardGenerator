
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
      // Type 0 = Auto detect version
      // 'M' = Medium (15%) - Reduces density compared to 'H', making modules larger and easier to scan quickly.
      // This is the standard sweet spot for general purpose reliable scanning.
      const qr = qrcode(0, 'M'); 
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

  const dataModules = [];
  
  modules.forEach((row, r) => {
    row.forEach((isDark, c) => {
      if (isFinder(r, c)) return; 
      if (isDark) {
        // Standard Square Modules for instant readability
        dataModules.push(
          <rect 
            key={`${r}-${c}`} 
            x={c} 
            y={r} 
            width={1} 
            height={1}
            fill={color} 
            shapeRendering="crispEdges"
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
    <svg viewBox={`0 0 ${count} ${count}`} width={size} height={size} shapeRendering="crispEdges">
      {/* Render the data modules */}
      {dataModules}
      
      {/* Render Standard Square Finder Patterns for instant recognition */}
      {finderLocations.map((loc, i) => (
        <g key={i} transform={`translate(${loc.x}, ${loc.y})`}>
          {/* Outer Ring (7x7 with 5x5 hole) */}
          <path 
            d="M0,0 h7 v7 h-7 z M1,1 v5 h5 v-5 z" 
            fill={color} 
            fillRule="evenodd"
          />
          {/* Inner Block (3x3) */}
          <rect x="2" y="2" width="3" height="3" fill={color} />
        </g>
      ))}
    </svg>
  );
};

export default QRCodePattern;

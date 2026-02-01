
import React from 'react';
import QRCodePattern from './QRCodePattern';
import { Student, CardConfig } from '../types';
import { RemoteImage } from './Logo';

interface IDCardProps {
  student: Student;
  config: CardConfig;
  id?: string;
}

// Inline SVG Pattern to ensure reliability in PDF generation (avoids CORS)
const CubePattern = () => (
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '20px 20px'
    }} 
  />
);

const IDCard: React.FC<IDCardProps> = ({ student, config, id }) => {
  const [firstName, ...lastNameParts] = student.name.split(' ');
  const lastName = lastNameParts.join(' ');

  // Helper for applying styles with defaults
  // We add !important via string manipulation or separate class for print safety, 
  // but since React style objects don't support !important easily, we rely on the specific print CSS in index.html 
  // to NOT override these, and we use high contrast defaults.
  const cardStyle: React.CSSProperties = {
    backgroundColor: config.cardBgColor,
    color: config.textColor,
    borderColor: 'rgba(30, 41, 59, 1)', // slate-800
    printColorAdjust: 'exact',
    WebkitPrintColorAdjust: 'exact',
  };

  return (
    <div id={id} className="id-card-inner-wrapper flex flex-col xl:flex-row gap-10 items-center justify-center p-4 bg-transparent rounded-xl">
      {/* FRONT SIDE - 80mm x 136mm -> 400px x 680px (1:5 Scale) */}
      <div 
        className="id-card-front relative w-[400px] h-[680px] rounded-[16px] overflow-hidden shadow-2xl flex flex-col font-sans shrink-0 border-[4px]"
        style={cardStyle}
      >
        
        {/* Background Elements */}
        {config.showPattern && <CubePattern />}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none"></div>
        
        {/* Header - Text Only, Centered */}
        <div className="pt-12 px-6 pb-4 flex flex-col items-center justify-center relative z-10 text-center">
          <h1 
            className="text-[18px] font-black leading-tight tracking-widest uppercase font-inter drop-shadow-lg mb-2"
            style={{ color: config.textColor }}
          >
            {config.schoolName}
          </h1>
          <div className="h-0.5 w-16 rounded-full mb-2" style={{ backgroundColor: config.accentColor, opacity: 0.5 }}></div>
          <p 
            className="text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: config.textColor, opacity: 0.7 }}
          >
            {config.schoolAddress}
          </p>
        </div>

        {/* Photo Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-4">
          {/* Photo Container - Larger for taller card */}
          <div 
             className="w-52 h-52 rounded-[2.5rem] bg-slate-800 border-4 shadow-2xl overflow-hidden relative group ring-1 ring-white/10"
             style={{ borderColor: 'rgba(51, 65, 85, 1)' }} // slate-700
          >
            {/* Placeholder / Image Area */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <svg className="w-24 h-24 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* Inner Glare Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Name Section */}
        <div className="relative z-10 px-6 text-center mb-8">
          <h2 
            className="text-4xl font-black uppercase tracking-tight leading-none drop-shadow-md break-words"
            style={{ color: config.textColor }}
          >
            {firstName}
          </h2>
          {lastName && (
             <h2 
                className="text-2xl font-bold uppercase tracking-tight leading-none mt-2 break-words"
                style={{ color: config.accentColor }}
             >
               {lastName}
             </h2>
          )}
        </div>

        {/* Details Footer */}
        <div className="relative z-10 px-6 pb-8 mt-auto">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-inner">
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <DetailItem label={config.labelClass} value={student.class} textColor={config.textColor} />
              <DetailItem label={config.labelSection} value={student.section} textColor={config.textColor} />
              <DetailItem label={config.labelId} value={student.studentId} highlightColor={config.accentColor} textColor={config.textColor} />
              {config.showContact && (
                 <DetailItem label={config.labelContact} value={student.contact || "N/A"} textColor={config.textColor} />
              )}
            </div>
            {/* Validity Bar */}
            <div className="mt-5 pt-4 border-t border-slate-700/50 flex justify-between items-end">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: config.textColor, opacity: 0.7 }}>{config.labelIssued}</span>
                  <span className="text-[12px] font-bold" style={{ color: config.textColor, opacity: 0.9 }}>{config.issuedYear}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: config.textColor, opacity: 0.7 }}>{config.labelValid}</span>
                  <span className="text-[12px] font-bold" style={{ color: config.accentColor }}>{config.validUntil}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div 
        className="id-card-back relative w-[400px] h-[680px] rounded-[16px] overflow-hidden shadow-2xl flex flex-col items-center p-8 shrink-0 border-[4px] justify-between"
        style={cardStyle}
      >
        
        {/* Subtle Pattern */}
        {config.showPattern && (
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        )}

        {/* Header Logo Area */}
        <div className="relative z-10 flex flex-col items-center w-full mt-8">
          <div className="mb-4 opacity-90 p-4 bg-white/5 rounded-2xl border border-white/5">
             <RemoteImage src={config.logoUrl} alt="Logo" className="w-20 h-20" />
          </div>
          <h3 className="font-black tracking-[0.3em] text-lg" style={{ color: config.textColor }}>QWICKATTEND</h3>
          <div className="h-1 w-12 rounded-full mt-4" style={{ backgroundColor: config.accentColor }}></div>
        </div>

        {/* QR Code Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full my-6">
          <div className="p-6 rounded-3xl shadow-2xl" style={{ backgroundColor: config.qrBgColor }}>
            <QRCodePattern 
              value={student.studentId} 
              size={220} 
              color={config.qrColor}
            />
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="relative z-10 flex flex-col items-center w-full mb-6">
          <div className="mb-6 px-6 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-lg">
             <span className="text-sm font-mono font-bold tracking-[0.2em]" style={{ color: config.accentColor }}>
               ID: {student.studentId}
             </span>
          </div>
          
          <p 
            className="text-[10px] text-center leading-relaxed max-w-[300px] font-medium" 
            style={{ color: config.textColor, opacity: 0.8 }}
          >
            {config.disclaimerText}
          </p>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; highlightColor?: string; textColor: string }> = ({ label, value, highlightColor, textColor }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: textColor, opacity: 0.7 }}>{label}</span>
    <span 
        className="text-[15px] font-bold truncate" 
        style={{ color: highlightColor || textColor, opacity: highlightColor ? 1 : 0.95 }}
    >
        {value}
    </span>
  </div>
);

export default IDCard;

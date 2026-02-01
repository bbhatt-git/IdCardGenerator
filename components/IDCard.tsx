
import React from 'react';
import QRCodePattern from './QRCodePattern';
import { Student, CardConfig } from '../types';
import { SarcLogo, QALogo } from './Logo';

interface IDCardProps {
  student: Student;
  config: CardConfig;
  id?: string;
}

const IDCard: React.FC<IDCardProps> = ({ student, config, id }) => {
  const [firstName, ...lastNameParts] = student.name.split(' ');
  const lastName = lastNameParts.join(' ');

  // NOTE: Removed 'blur-3xl' and 'backdrop-blur' classes as they frequently cause 
  // html-to-image to crash or produce blank canvases.
  
  return (
    <div id={id} className="id-card-inner-wrapper flex flex-col xl:flex-row gap-8 items-center justify-center p-4 bg-slate-900/50 rounded-xl">
      {/* FRONT SIDE */}
      <div className="id-card-front relative w-[320px] h-[504px] bg-[#0c1322] rounded-[24px] overflow-hidden shadow-xl border border-slate-700/50 flex flex-col font-sans shrink-0">
        {/* Background Patterns - Simplified for Render Stability */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-500/5 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-6 flex items-center gap-3 z-10 relative">
          <SarcLogo className="w-10 h-10" />
          <div className="flex flex-col">
            <h1 className="text-[11px] font-black text-white leading-tight tracking-wide uppercase">{config.schoolName}</h1>
            <p className="text-[8px] text-slate-400 font-medium tracking-wider uppercase">{config.schoolAddress}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 flex flex-col flex-1 z-10 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white uppercase leading-none tracking-tight break-words max-w-[200px]">{firstName}</h2>
              <h2 className="text-2xl font-black text-lime-400 uppercase leading-none mt-1 tracking-tight break-words max-w-[200px]">{lastName}</h2>
            </div>
            <QALogo className="opacity-80 scale-90" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
            <DetailItem label="GRADE" value={student.class} />
            <DetailItem label="SECTION" value={student.section} />
            <DetailItem label="STUDENT ID" value={student.studentId} />
            <DetailItem label="CONTACT" value={student.contact || "-"} />
            <DetailItem label="ISSUED" value={config.issuedYear} />
            <DetailItem label="VALID UNTIL" value={config.validUntil} />
          </div>

          {/* Avatar Placeholder */}
          <div className="mt-auto mb-8 mx-auto w-32 h-32 bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-700">
            <svg className="w-20 h-20 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 py-3 text-center border-t border-slate-700 z-10">
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">QWICKATTEND.COM.NP</span>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="id-card-back relative w-[320px] h-[504px] bg-[#0c1322] rounded-[24px] overflow-hidden shadow-xl border border-slate-700/50 flex flex-col items-center justify-center p-8 shrink-0">
         {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-lime-900/10 pointer-events-none"></div>

        <div className="mb-6 scale-125 relative z-10">
          <QALogo />
        </div>

        <h3 className="text-lime-400 font-black tracking-[0.1em] text-lg mb-4 relative z-10">QWICKATTEND</h3>
        
        <p className="text-[10px] text-center text-slate-300 leading-relaxed px-2 mb-8 font-medium opacity-80 relative z-10">
          QwickAttend is a modern system designed to simplify and automate the attendance process for institutions. Leveraging modern technology like QR codes and NFC, it makes tracking student attendance fast, accurate, and effortless.
        </p>

        {/* QR Code Frame */}
        <div 
          className="relative p-3 rounded-2xl bg-white shadow-lg z-10"
        >
          <QRCodePattern 
            value={student.studentId} 
            size={130}
            color={config.qrColor}
          />
        </div>
        
        <div className="mt-8 text-[9px] text-slate-500 font-mono">
           ID: {student.studentId}
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[8px] font-bold text-slate-500 tracking-widest mb-0.5">{label}</span>
    <span className="text-[11px] font-bold text-slate-100 truncate pr-2">{value}</span>
  </div>
);

export default IDCard;


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

  return (
    <div id={id} className="id-card-inner-wrapper flex flex-col md:flex-row gap-8 items-center justify-center p-4 bg-slate-900/50 rounded-xl">
      {/* FRONT SIDE */}
      <div className="relative w-[320px] h-[520px] bg-[#0c1322] rounded-[40px] overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col font-sans shrink-0">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-lime-900/10 pointer-events-none"></div>
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="p-6 flex items-center gap-3 z-10">
          <SarcLogo className="w-10 h-10" />
          <div className="flex flex-col">
            <h1 className="text-[11px] font-black text-white leading-tight tracking-wide">{config.schoolName}</h1>
            <p className="text-[8px] text-slate-400 font-medium tracking-wider">{config.schoolAddress}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 flex flex-col flex-1 z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white uppercase leading-none tracking-tight">{firstName}</h2>
              <h2 className="text-2xl font-black text-lime-400 uppercase leading-none mt-1 tracking-tight">{lastName}</h2>
            </div>
            <QALogo className="opacity-80 scale-90" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-3 mb-6">
            <DetailItem label="GRADE" value={student.class} />
            <DetailItem label="SECTION" value={student.section} />
            <DetailItem label="STUDENT ID" value={student.studentId} />
            <DetailItem label="CONTACT" value={student.contact || "----------"} />
            <DetailItem label="ISSUED YEAR" value={config.issuedYear} />
            <DetailItem label="VALID UNTIL" value={config.validUntil} />
          </div>

          {/* Avatar Placeholder */}
          <div className="mt-auto mb-8 mx-auto w-40 h-40 bg-slate-700 rounded-2xl relative overflow-hidden flex items-center justify-center">
            {/* Simple User SVG Placeholder */}
            <svg className="w-32 h-32 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <div className="absolute inset-0 border-4 border-slate-600/30 rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/80 py-3 text-center border-t border-slate-700/50 backdrop-blur-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">QWICKATTEND.COM.NP</span>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="relative w-[320px] h-[520px] bg-[#0c1322] rounded-[40px] overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col items-center justify-center p-8 z-0 shrink-0">
         {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-lime-900/10 pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-lime-500/10 rounded-full blur-3xl"></div>

        <div className="mb-8 scale-150">
          <QALogo />
        </div>

        <h3 className="text-lime-400 font-black tracking-[0.1em] text-lg mb-4">QWICKATTEND</h3>
        
        <p className="text-[10px] text-center text-slate-300 leading-relaxed px-4 mb-10 font-medium opacity-80">
          QwickAttend is a modern system designed to simplify and automate the attendance process for institutions. Leveraging modern technology like QR codes and NFC, it makes tracking student attendance fast, accurate, and effortless.
        </p>

        {/* QR Code Frame */}
        <div 
          className="relative p-3 rounded-3xl shadow-[0_0_30px_rgba(132,204,22,0.15)] transition-colors duration-300"
          style={{ backgroundColor: config.qrBgColor }}
        >
          <QRCodePattern 
            value={student.studentId} 
            size={140}
            color={config.qrColor}
          />
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[7px] font-bold text-slate-500 tracking-widest">{label}:</span>
    <span className="text-[10px] font-bold text-slate-100">{value}</span>
  </div>
);

export default IDCard;

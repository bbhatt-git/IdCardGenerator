
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
    <div id={id} className="id-card-inner-wrapper flex flex-col xl:flex-row gap-8 items-center justify-center p-4 bg-transparent rounded-xl">
      {/* FRONT SIDE - 350px x 500px corresponds to 70mm x 100mm (7:10 Aspect Ratio) */}
      <div className="id-card-front relative w-[350px] h-[500px] bg-[#0c1322] rounded-[16px] overflow-hidden shadow-2xl flex flex-col font-sans shrink-0 border-[3px] border-slate-800">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-lime-400 to-blue-600"></div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-blue-600/10 rounded-full blur-none translate-x-12 -translate-y-12 pointer-events-none rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="pt-10 px-6 pb-4 flex items-center gap-4 relative z-10 border-b border-slate-800/50">
          <div className="bg-white/5 p-2.5 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
             <SarcLogo className="w-12 h-12" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[14px] font-black text-white leading-tight tracking-wider uppercase font-inter drop-shadow-md">{config.schoolName}</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1">{config.schoolAddress}</p>
          </div>
        </div>

        {/* Photo & Name Section */}
        <div className="px-6 py-6 flex flex-col items-center z-10 relative flex-1 justify-center">
          <div className="w-40 h-40 bg-slate-800 rounded-[2rem] border-4 border-slate-700/50 shadow-2xl flex items-center justify-center mb-6 relative overflow-hidden group ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40"></div>
            <svg className="w-20 h-20 text-slate-600 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          
          <div className="text-center w-full space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none truncate drop-shadow-lg">{firstName}</h2>
            <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-tight leading-none truncate">{lastName}</h2>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 pb-8 mt-auto z-10 relative">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 grid grid-cols-2 gap-y-4 gap-x-4 shadow-xl">
            <DetailItem label="Class" value={student.class} />
            <DetailItem label="Section" value={student.section} />
            <DetailItem label="Student ID" value={student.studentId} highlight />
            <DetailItem label="Contact" value={student.contact || "N/A"} />
            <DetailItem label="Issued" value={config.issuedYear} />
            <DetailItem label="Valid Until" value={config.validUntil} />
          </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="id-card-back relative w-[350px] h-[500px] bg-[#0c1322] rounded-[16px] overflow-hidden shadow-2xl flex flex-col items-center p-8 shrink-0 border-[3px] border-slate-800 justify-between">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-lime-400 to-blue-600"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10 flex flex-col items-center w-full mt-6">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 mb-4">
            <QALogo className="w-20 h-20 opacity-90" />
          </div>
          <h3 className="text-white font-black tracking-[0.3em] text-sm mb-2">QWICKATTEND</h3>
          <div className="h-0.5 w-16 bg-blue-500 rounded-full mb-6 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        </div>

        {/* QR Code - Enlarged for readability */}
        <div className="relative z-10 p-4 bg-white rounded-3xl shadow-2xl">
          <QRCodePattern 
            value={student.studentId} 
            size={180} 
            color={config.qrColor}
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center w-full mb-6">
          <p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-[260px] font-medium mb-5">
            This card is the property of <span className="text-slate-200 font-bold">{config.schoolName}</span>. 
            If found, please return to the school administration.
          </p>
          <div className="px-5 py-2 bg-slate-900 rounded-xl border border-slate-700 shadow-inner">
            <span className="text-xs font-mono font-bold text-blue-400 tracking-widest">ID: {student.studentId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</span>
    <span className={`text-[13px] font-bold truncate ${highlight ? 'text-lime-400' : 'text-slate-200'}`}>{value}</span>
  </div>
);

export default IDCard;

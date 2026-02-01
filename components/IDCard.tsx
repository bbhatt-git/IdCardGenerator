
import React from 'react';
import QRCodePattern from './QRCodePattern';
import { Student, CardConfig } from '../types';
import { RemoteImage } from './Logo';

interface IDCardProps {
  student: Student;
  config: CardConfig;
  id?: string;
}

const IDCard: React.FC<IDCardProps> = ({ student, config, id }) => {
  const [firstName, ...lastNameParts] = student.name.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <div id={id} className="id-card-inner-wrapper flex flex-col xl:flex-row gap-10 items-center justify-center p-4 bg-transparent rounded-xl">
      {/* FRONT SIDE - 80mm x 136mm -> 400px x 680px (1:5 Scale) */}
      <div className="id-card-front relative w-[400px] h-[680px] bg-[#0f172a] rounded-[16px] overflow-hidden shadow-2xl flex flex-col font-sans shrink-0 border-[4px] border-slate-800">
        
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none"></div>
        
        {/* Accent Lines */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600"></div>

        {/* Header - Text Only, Centered */}
        <div className="pt-12 px-6 pb-4 flex flex-col items-center justify-center relative z-10 text-center">
          <h1 className="text-[18px] font-black text-white leading-tight tracking-widest uppercase font-inter drop-shadow-lg mb-2">
            {config.schoolName}
          </h1>
          <div className="h-0.5 w-16 bg-blue-500/50 rounded-full mb-2"></div>
          <p className="text-[11px] text-slate-400 font-bold tracking-[0.2em] uppercase">
            {config.schoolAddress}
          </p>
        </div>

        {/* Photo Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-4">
          {/* Photo Container - Larger for taller card */}
          <div className="w-52 h-52 rounded-[2.5rem] bg-slate-800 border-4 border-slate-700 shadow-2xl overflow-hidden relative group ring-1 ring-white/10">
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
          <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md break-words">
            {firstName}
          </h2>
          {lastName && (
             <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-tight leading-none mt-2 break-words">
               {lastName}
             </h2>
          )}
        </div>

        {/* Details Footer */}
        <div className="relative z-10 px-6 pb-8 mt-auto">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-inner">
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <DetailItem label="CLASS" value={student.class} />
              <DetailItem label="SECTION" value={student.section} />
              <DetailItem label="ID NO" value={student.studentId} highlight />
              <DetailItem label="CONTACT" value={student.contact || "N/A"} />
            </div>
            {/* Validity Bar */}
            <div className="mt-5 pt-4 border-t border-slate-700/50 flex justify-between items-end">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">ISSUED</span>
                  <span className="text-[12px] font-bold text-slate-300">{config.issuedYear}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">VALID UNTIL</span>
                  <span className="text-[12px] font-bold text-emerald-400">{config.validUntil}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="id-card-back relative w-[400px] h-[680px] bg-[#0f172a] rounded-[16px] overflow-hidden shadow-2xl flex flex-col items-center p-8 shrink-0 border-[4px] border-slate-800 justify-between">
        {/* Top Gradient */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600"></div>
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        {/* Header Logo Area */}
        <div className="relative z-10 flex flex-col items-center w-full mt-8">
          <div className="mb-4 opacity-90 p-4 bg-white/5 rounded-2xl border border-white/5">
             <RemoteImage src={config.logoUrl} alt="Logo" className="w-20 h-20" />
          </div>
          <h3 className="text-white font-black tracking-[0.3em] text-lg">QWICKATTEND</h3>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-4"></div>
        </div>

        {/* QR Code Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full my-6">
          <div className="p-6 bg-white rounded-3xl shadow-2xl">
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
             <span className="text-sm font-mono font-bold text-blue-400 tracking-[0.2em]">ID: {student.studentId}</span>
          </div>
          
          <p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-[280px] font-medium">
            This card is the property of <span className="text-white font-bold">{config.schoolName}</span>. 
            If found, please return to the school administration.
          </p>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-[15px] font-bold truncate ${highlight ? 'text-lime-400' : 'text-slate-200'}`}>{value}</span>
  </div>
);

export default IDCard;

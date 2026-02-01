
import React, { useState, useRef, useEffect } from 'react';
import { Student, CardConfig } from './types';
import IDCard from './components/IDCard';
import { Upload, FileSpreadsheet, Download, Plus, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

const DEFAULT_CONFIG: CardConfig = {
  schoolName: 'SARC EDUCATION FOUNDATION',
  schoolAddress: 'BHIMDATTA-06, AITHPUR, KANCHANPUR',
  issuedYear: '2082',
  validUntil: 'CHAITRA 2082',
  qrColor: '#000000',
  qrBgColor: '#FFFFFF',
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load fonts for the page
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        return {
          name: values[0]?.trim() || '',
          class: values[1]?.trim() || '',
          section: values[2]?.trim() || '',
          studentId: values[3]?.trim() || '',
          contact: values[4]?.trim() || '',
        };
      });
      setStudents(data);
      setActiveTab('list');
    };
    reader.readAsText(file);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setStudents([]);
      setActiveTab('upload');
    }
  };

  const handleDownloadPDF = async () => {
    if (isGenerating || students.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const targetImgWidth = 180; 
      
      let yOffset = margin;
      
      for (let i = 0; i < students.length; i++) {
        setProgress(Math.round(((i + 1) / students.length) * 100));
        
        const element = document.getElementById(`card-${i}`);
        if (!element) continue;

        try {
          // Use more robust options for html-to-image
          const dataUrl = await toPng(element, { 
            quality: 1, 
            pixelRatio: 2,
            backgroundColor: 'rgba(0,0,0,0)',
            cacheBust: true,
            // Style overrides to ensure transparency during capture
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              transform: 'none'
            }
          });

          if (!dataUrl || dataUrl === 'data:,') {
            console.error(`Failed to capture card ${i}`);
            continue;
          }

          const imgProps = doc.getImageProperties(dataUrl);
          const pdfHeight = (imgProps.height * targetImgWidth) / imgProps.width;

          // Check for page break
          if (yOffset + pdfHeight > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
          }

          doc.addImage(dataUrl, 'PNG', (pageWidth - targetImgWidth) / 2, yOffset, targetImgWidth, pdfHeight);
          yOffset += pdfHeight + 8;
          
          // Brief pause to keep UI responsive and ensure memory management
          await new Promise(resolve => setTimeout(resolve, 50));

        } catch (err) {
          console.error(`Error generating card ${i}`, err);
        }
      }

      doc.save('QwickAttend_ID_Cards.pdf');

    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <FileSpreadsheet className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight">QwickAttend <span className="text-blue-500 italic">Gen</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">ID Card Automation Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {students.length > 0 && (
            <>
              <button 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-wait min-w-[160px] justify-center"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {isGenerating ? `Generating ${progress}%` : 'Download PDF'}
              </button>
              <button 
                onClick={clearData}
                disabled={isGenerating}
                className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all border border-red-500/20"
                title="Clear Data"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
          <button 
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            <Edit2 size={18} />
            Config
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Upload State */}
        {activeTab === 'upload' && students.length === 0 && (
          <div className="max-w-2xl mx-auto mt-20 text-center">
            <div className="mb-8 p-12 border-2 border-dashed border-slate-800 rounded-[40px] bg-slate-900/30">
              <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="text-blue-500 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black mb-4">Start Generating Cards</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Upload your student CSV file to batch-generate high-quality ID cards.
              </p>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv" 
                onChange={handleCsvUpload}
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-lg font-black transition-all shadow-xl shadow-blue-900/40 group"
              >
                <Plus className="group-hover:rotate-90 transition-transform" />
                Select CSV File
              </button>

              <div className="mt-12 p-6 bg-slate-800/30 rounded-2xl border border-slate-800 text-left">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Expected CSV Headers</h3>
                <code className="text-blue-400 text-sm font-mono block p-2 bg-slate-900 rounded-lg border border-slate-700/50 overflow-x-auto">
                  name, class, section, studentId, contact
                </code>
              </div>
            </div>
          </div>
        )}

        {/* List State */}
        {students.length > 0 && (
          <div className="flex flex-col gap-12">
            <div className="no-print flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Generated Cards</h2>
                <p className="text-slate-400 font-medium">Ready for {students.length} students</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold border border-slate-700 disabled:opacity-50"
                >
                  Change File
                </button>
              </div>
            </div>

            {/* Grid Container */}
            <div className="cards-grid grid grid-cols-1 gap-12">
              {students.map((student, index) => (
                <div key={index} className="id-card-wrapper flex justify-center">
                   <IDCard 
                     id={`card-${index}`}
                     student={student} 
                     config={config} 
                   />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Configuration Drawer */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end no-print">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsConfigOpen(false)}></div>
          <div className="relative w-full max-w-md h-full bg-[#0c1322] border-l border-slate-800 p-8 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Global Config</h2>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2 flex-1">
              <ConfigInput 
                label="Institution Name" 
                value={config.schoolName} 
                onChange={(v) => setConfig({...config, schoolName: v})} 
              />
              <ConfigInput 
                label="Address" 
                value={config.schoolAddress} 
                onChange={(v) => setConfig({...config, schoolAddress: v})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <ConfigInput 
                  label="Issued Year" 
                  value={config.issuedYear} 
                  onChange={(v) => setConfig({...config, issuedYear: v})} 
                />
                <ConfigInput 
                  label="Valid Until" 
                  value={config.validUntil} 
                  onChange={(v) => setConfig({...config, validUntil: v})} 
                />
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">QR Styling</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput 
                    label="QR Dots" 
                    value={config.qrColor} 
                    onChange={(v) => setConfig({...config, qrColor: v})} 
                  />
                  <ColorInput 
                    label="Background" 
                    value={config.qrBgColor} 
                    onChange={(v) => setConfig({...config, qrBgColor: v})} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button 
                onClick={() => setIsConfigOpen(false)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg transition-all"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfigInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>
);

const ColorInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2">
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0"
      />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent border-none text-xs font-mono text-slate-300 focus:outline-none"
      />
    </div>
  </div>
);

export default App;

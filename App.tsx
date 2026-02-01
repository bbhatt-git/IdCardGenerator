
import React, { useState, useRef, useEffect } from 'react';
import { Student, CardConfig } from './types';
import IDCard from './components/IDCard';
import { Upload, FileSpreadsheet, Download, Plus, Trash2, Edit2, X, Loader2, Image as ImageIcon, Palette, Type, Eye, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

const DEFAULT_CONFIG: CardConfig = {
  schoolName: 'SARC EDUCATION FOUNDATION',
  schoolAddress: 'BHIMDATTA-06, AITHPUR, KANCHANPUR',
  issuedYear: '2082',
  validUntil: 'CHAITRA 2082',
  qrColor: '#000000',
  qrBgColor: '#FFFFFF',
  logoUrl: 'https://raw.githubusercontent.com/bbhatt-git/IdCardGenerator/refs/heads/main/public/sarc.png',
  backLogoUrl: 'https://raw.githubusercontent.com/bbhatt-git/IdCardGenerator/refs/heads/main/public/qa.png',
  
  cardBgColor: '#0f172a',
  accentColor: '#3b82f6', // blue-500
  textColor: '#ffffff',
  detailsColor: '#ffffff',
  labelColor: '#94a3b8', // slate-400
  backTextColor: '#ffffff',
  showPattern: true,

  labelClass: 'CLASS',
  labelSection: 'SECTION',
  labelId: 'ID NO',
  labelContact: 'CONTACT',
  
  labelIssued: 'ISSUED',
  labelValid: 'VALID UNTIL',
  
  disclaimerText: 'This card is designated for the temporary testing of the QwickAttend system and does not constitute an official identification credential. Please handle this card with care to ensure the integrity and accuracy of the testing process.',

  showContact: true,
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backLogoInputRef = useRef<HTMLInputElement>(null);
  const [configTab, setConfigTab] = useState<'general' | 'appearance' | 'labels'>('general');

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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
        alert('Please upload a PNG image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setConfig(prev => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleBackLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
        alert('Please upload a PNG image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setConfig(prev => ({ ...prev, backLogoUrl: result }));
    };
    reader.readAsDataURL(file);
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

    // Ensure fonts and images are ready
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500)); // Buffer time

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Requested Size: 80mm x 136mm
      const CARD_WIDTH = 80;
      const CARD_HEIGHT = 136; 
      
      const PAGE_WIDTH = 210;
      const PAGE_HEIGHT = 297;
      
      const GAP_X = 10; // Gap between Front and Back of the same student
      const GAP_Y = 10; // Vertical gap between Student 1 and Student 2 rows
      
      // Calculate layout
      // We want 2 students per page. Each student takes a row.
      // Row content: [Front] [Gap] [Back]
      const ROW_WIDTH = (CARD_WIDTH * 2) + GAP_X;
      const MARGIN_LEFT = (PAGE_WIDTH - ROW_WIDTH) / 2;
      
      // Vertical centering for 2 rows
      const TOTAL_CONTENT_HEIGHT = (CARD_HEIGHT * 2) + GAP_Y;
      const MARGIN_TOP = (PAGE_HEIGHT - TOTAL_CONTENT_HEIGHT) / 2;

      const drawCropMarks = (x: number, y: number, w: number, h: number) => {
        const len = 4; // length of crop mark line
        const offset = 2; // distance from corner
        doc.setDrawColor(0, 0, 0); // Black
        doc.setLineWidth(0.1);

        // Top Left
        doc.line(x - offset - len, y, x - offset, y); 
        doc.line(x, y - offset - len, x, y - offset); 

        // Top Right
        doc.line(x + w + offset, y, x + w + offset + len, y);
        doc.line(x + w, y - offset - len, x + w, y - offset);

        // Bottom Left
        doc.line(x - offset - len, y + h, x - offset, y + h);
        doc.line(x, y + h + offset, x, y + h + offset + len);

        // Bottom Right
        doc.line(x + w + offset, y + h, x + w + offset + len, y + h);
        doc.line(x + w, y + h + offset, x + w, y + h + offset + len);
      };

      for (let i = 0; i < students.length; i++) {
        setProgress(Math.round(((i + 1) / students.length) * 100));
        
        // Every 2 students, start a new page.
        // i % 2 === 0 means it's the start of a page (unless it's the very first one).
        if (i > 0 && i % 2 === 0) {
            doc.addPage();
        }

        const wrapperElement = document.getElementById(`card-${i}`);
        if (!wrapperElement) continue;

        const frontEl = wrapperElement.querySelector('.id-card-front') as HTMLElement;
        const backEl = wrapperElement.querySelector('.id-card-back') as HTMLElement;

        if (!frontEl || !backEl) continue;

        try {
          // Capture settings matching the aspect ratio 80:136 (400:680)
          const commonOptions = {
            quality: 1.0,
            pixelRatio: 4, // High resolution for print
            cacheBust: true,
            backgroundColor: 'transparent',
            width: 400, 
            height: 680,
            style: { transform: 'none', margin: '0' }
          };

          const frontDataUrl = await toPng(frontEl, commonOptions);
          const backDataUrl = await toPng(backEl, commonOptions);

          // Determine position
          const rowIndex = i % 2; // 0 for top row, 1 for bottom row
          const y = MARGIN_TOP + (rowIndex * (CARD_HEIGHT + GAP_Y));
          
          const frontX = MARGIN_LEFT;
          const backX = MARGIN_LEFT + CARD_WIDTH + GAP_X;

          // Add Images
          doc.addImage(frontDataUrl, 'PNG', frontX, y, CARD_WIDTH, CARD_HEIGHT);
          doc.addImage(backDataUrl, 'PNG', backX, y, CARD_WIDTH, CARD_HEIGHT);

          // Draw Crop Marks
          drawCropMarks(frontX, y, CARD_WIDTH, CARD_HEIGHT);
          drawCropMarks(backX, y, CARD_WIDTH, CARD_HEIGHT);

          // Fold line between front and back
          doc.setDrawColor(200, 200, 200);
          doc.setLineDashPattern([2, 2], 0);
          doc.line(backX - (GAP_X/2), y, backX - (GAP_X/2), y + CARD_HEIGHT);
          doc.setLineDashPattern([], 0); // Reset

          // Label text
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Student: ${students[i].name} (${students[i].studentId})`, MARGIN_LEFT, y - 3);

          await new Promise(resolve => setTimeout(resolve, 50));

        } catch (err) {
          console.error(`Error generating card ${i}`, err);
        }
      }

      doc.save('QwickAttend_ID_Cards_80x136.pdf');

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
                {isGenerating ? `Processing ${progress}%` : 'Download PDF (80x136mm)'}
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
          <div className="relative w-full max-w-md h-full bg-[#0c1322] border-l border-slate-800 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0f172a]">
              <h2 className="text-xl font-black">Configuration</h2>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Config Tabs */}
            <div className="flex border-b border-slate-800 bg-[#0f172a]/50">
               <button 
                 onClick={() => setConfigTab('general')}
                 className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${configTab === 'general' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 General
               </button>
               <button 
                 onClick={() => setConfigTab('appearance')}
                 className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${configTab === 'appearance' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Design
               </button>
               <button 
                 onClick={() => setConfigTab('labels')}
                 className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${configTab === 'labels' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Content
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {configTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Front Logo Upload */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Front: School Logo</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                          {config.logoUrl ? (
                            <img src={config.logoUrl} alt="School Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                            <ImageIcon className="text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            ref={logoInputRef}
                            accept="image/png"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <button 
                            onClick={() => logoInputRef.current?.click()}
                            className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold border border-slate-700 transition-colors mb-2"
                          >
                            Upload PNG Logo
                          </button>
                        </div>
                    </div>
                  </div>

                  {/* Back Logo Upload */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Back: QwickAttend Logo</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                          {config.backLogoUrl ? (
                            <img src={config.backLogoUrl} alt="Back Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                            <ImageIcon className="text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            ref={backLogoInputRef}
                            accept="image/png"
                            onChange={handleBackLogoUpload}
                            className="hidden"
                          />
                          <button 
                            onClick={() => backLogoInputRef.current?.click()}
                            className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold border border-slate-700 transition-colors mb-2"
                          >
                            Upload PNG Logo
                          </button>
                        </div>
                    </div>
                  </div>

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
                </div>
              )}

              {configTab === 'appearance' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                   {/* Colors */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette size={16} className="text-blue-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Color Scheme</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                          <ColorInput 
                            label="Card Background" 
                            value={config.cardBgColor} 
                            onChange={(v) => setConfig({...config, cardBgColor: v})} 
                          />
                          <ColorInput 
                            label="Accent Color" 
                            value={config.accentColor} 
                            onChange={(v) => setConfig({...config, accentColor: v})} 
                          />
                          <div className="h-px bg-slate-800 my-2" />
                          <ColorInput 
                            label="Main Text (Front Name/School)" 
                            value={config.textColor} 
                            onChange={(v) => setConfig({...config, textColor: v})} 
                          />
                          <ColorInput 
                            label="Details Content (Class/ID/etc)" 
                            value={config.detailsColor} 
                            onChange={(v) => setConfig({...config, detailsColor: v})} 
                          />
                          <ColorInput 
                            label="Label Text (CLASS/SECTION tags)" 
                            value={config.labelColor} 
                            onChange={(v) => setConfig({...config, labelColor: v})} 
                          />
                          <ColorInput 
                            label="Back Side Text" 
                            value={config.backTextColor} 
                            onChange={(v) => setConfig({...config, backTextColor: v})} 
                          />
                      </div>
                   </div>

                   {/* Pattern Toggle */}
                   <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                         <ImageIcon size={16} className="text-blue-500" />
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider">Texture</h3>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                          <span className="text-sm font-medium text-slate-300">Background Pattern</span>
                          <Toggle 
                            checked={config.showPattern} 
                            onChange={(c) => setConfig({...config, showPattern: c})} 
                          />
                      </div>
                   </div>

                   {/* QR Styling */}
                   <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-white rounded-sm"></div>
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider">QR Code</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <ColorInput 
                          label="Dots Color" 
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
              )}

              {configTab === 'labels' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   {/* Field Labels */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Type size={16} className="text-blue-500" />
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider">Field Labels</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <ConfigInput 
                           label="Class Label" 
                           value={config.labelClass} 
                           onChange={(v) => setConfig({...config, labelClass: v})} 
                         />
                         <ConfigInput 
                           label="Section Label" 
                           value={config.labelSection} 
                           onChange={(v) => setConfig({...config, labelSection: v})} 
                         />
                         <ConfigInput 
                           label="ID Label" 
                           value={config.labelId} 
                           onChange={(v) => setConfig({...config, labelId: v})} 
                         />
                         <ConfigInput 
                           label="Contact Label" 
                           value={config.labelContact} 
                           onChange={(v) => setConfig({...config, labelContact: v})} 
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <ConfigInput 
                           label="Issued Label" 
                           value={config.labelIssued} 
                           onChange={(v) => setConfig({...config, labelIssued: v})} 
                         />
                         <ConfigInput 
                           label="Valid Label" 
                           value={config.labelValid} 
                           onChange={(v) => setConfig({...config, labelValid: v})} 
                         />
                      </div>
                   </div>

                   {/* Disclaimer */}
                   <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                         <FileText size={16} className="text-blue-500" />
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider">Back Disclaimer</h3>
                      </div>
                      <div className="flex flex-col gap-2">
                        <textarea 
                          value={config.disclaimerText} 
                          onChange={(e) => setConfig({...config, disclaimerText: e.target.value})}
                          rows={5}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>
                   </div>

                   {/* Visibility */}
                   <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                         <Eye size={16} className="text-blue-500" />
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider">Visibility</h3>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                          <span className="text-sm font-medium text-slate-300">Show Contact Info</span>
                          <Toggle 
                            checked={config.showContact} 
                            onChange={(c) => setConfig({...config, showContact: c})} 
                          />
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-800 bg-[#0c1322]">
              <button 
                onClick={() => setIsConfigOpen(false)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-900/20"
              >
                Done
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

const Toggle: React.FC<{ checked: boolean; onChange: (c: boolean) => void }> = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'left-7' : 'left-1'}`} />
  </button>
);

export default App;

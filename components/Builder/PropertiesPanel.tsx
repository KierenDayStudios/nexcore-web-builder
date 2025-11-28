import React, { useState, useRef } from 'react';
import { SiteElement, AIConfig } from '../../types';
import { generateAIContent } from '../../utils/aiService';
import { 
  X, AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, Layout, 
  Move, Maximize, Columns, ChevronDown, Sparkles, Loader2, Bold, 
  Italic, Underline, Grid, ArrowUpDown, ArrowLeftRight, Minus, 
  Plus, Monitor, Palette, BoxSelect, ImageIcon, DollarSign, Upload
} from 'lucide-react';

interface PropertiesPanelProps {
  element: SiteElement | null;
  onUpdate: (id: string, newProps: Record<string, any>) => void;
  onClose: () => void;
  aiConfig: AIConfig;
  systemContext: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  element, 
  onUpdate, 
  onClose,
  aiConfig,
  systemContext
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    layout: true,
    spacing: true,
    typography: true,
    appearance: true
  });
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFieldForAi, setActiveFieldForAi] = useState<string | null>(null);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!element) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-500 z-20">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
          <Move size={24} className="opacity-40" />
        </div>
        <p className="font-medium text-slate-300">No Selection</p>
        <p className="text-sm mt-2 max-w-[200px]">Click any element on the canvas to edit its properties.</p>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (key: string, value: any) => {
    onUpdate(element.id, { ...element.props, [key]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetProp: string = 'src') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // If updating background image, wrap in url()
        if (targetProp === 'backgroundImage') {
             const styles = element.props.style || {};
             onUpdate(element.id, { 
                 ...element.props, 
                 style: { ...styles, backgroundImage: `url('${result}')` } 
             });
        } else {
             handleChange(targetProp, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentClasses = (element.props.className || '') as string;
  const currentStyles = (element.props.style || {}) as Record<string, string>;

  // Helper to safely toggle tailwind classes without conflicts
  const updateClass = (pattern: RegExp, newClass: string) => {
    let classes = currentClasses;
    if (classes.match(pattern)) {
      classes = classes.replace(pattern, newClass);
    } else {
      classes = `${classes} ${newClass}`;
    }
    handleChange('className', classes.replace(/\s+/g, ' ').trim());
  };

  const updateStyle = (key: string, value: string) => {
    const newStyles = { ...currentStyles, [key]: value };
    // Clean up empty keys
    if (!value) delete newStyles[key];
    handleChange('style', newStyles);
  };

  const handleAiGenerate = async (targetField: string, customPrompt?: string) => {
    if (!aiConfig.apiKey && aiConfig.provider !== 'custom') {
      alert("Please configure an API Key in Settings first.");
      return;
    }

    setIsGenerating(true);
    try {
      const currentText = element.props[targetField] || '';
      const prompt = customPrompt || aiPrompt || "Improve this text";
      
      const result = await generateAIContent(aiConfig, prompt, systemContext, currentText);
      
      handleChange(targetField, result);
      setActiveFieldForAi(null);
      setAiPrompt('');
    } catch (e) {
      alert("AI Error: " + (e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderAiAssist = (field: string) => (
    <div className="relative inline-block ml-2">
      <button 
        onClick={() => setActiveFieldForAi(activeFieldForAi === field ? null : field)}
        className={`p-1.5 rounded-md transition-all ${
          activeFieldForAi === field 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
            : 'text-blue-400 hover:bg-blue-900/30'
        }`}
        title="AI Assist"
      >
        <Sparkles size={14} />
      </button>

      {activeFieldForAi === field && (
        <div className="absolute right-0 top-8 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Sparkles size={12} /> AI Writer
          </div>
          
          <div className="space-y-2 mb-3">
             <button 
               onClick={() => handleAiGenerate(field, "Fix grammar and spelling")}
               disabled={isGenerating}
               className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
             >
               Fix Grammar
             </button>
             <button 
               onClick={() => handleAiGenerate(field, "Make it punchier and more marketing-focused")}
               disabled={isGenerating}
               className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
             >
               Make it Punchier
             </button>
             <button 
               onClick={() => handleAiGenerate(field, "Make it shorter and concise")}
               disabled={isGenerating}
               className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
             >
               Shorten
             </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Custom prompt..."
              className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate(field)}
            />
            <button 
              onClick={() => handleAiGenerate(field)}
              disabled={isGenerating}
              className="absolute right-1 top-1 p-1 text-blue-400 hover:text-white rounded"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <ArrowRightIcon size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-30">
      {/* Header */}
      <div className="h-14 border-b border-slate-800 flex justify-between items-center px-4 bg-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200 capitalize tracking-tight">{element.type}</span>
          <span className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 bg-slate-800 rounded">#{element.id.slice(-4)}</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-800 rounded transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/30 shrink-0">
        <button 
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'style' ? 'border-blue-500 text-blue-400 bg-slate-800/30' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Style
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content' ? 'border-blue-500 text-blue-400 bg-slate-800/30' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Content
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* ================= STYLE TAB ================= */}
        {activeTab === 'style' && (
          <div className="p-4 space-y-1">
            
            {/* LAYOUT SECTION */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50 mb-2">
              <button onClick={() => toggleSection('layout')} className="w-full flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Layout size={12} /> Layout
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${openSections.layout ? 'rotate-180' : ''}`} />
              </button>
              
              {openSections.layout && (
                <div className="p-3 space-y-4">
                  {/* Display */}
                  <div className="flex bg-slate-950 p-1 rounded border border-slate-800">
                     {['block', 'flex', 'grid', 'hidden'].map(d => (
                       <button
                        key={d}
                        onClick={() => updateClass(/(block|flex|grid|hidden)/, d)}
                        className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded transition-colors ${currentClasses.includes(d) ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                       >
                         {d}
                       </button>
                     ))}
                  </div>

                  {/* Flex Options */}
                  {currentClasses.includes('flex') && (
                    <div className="space-y-3 p-2 bg-slate-950/50 rounded border border-slate-800/50">
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-slate-500">Direction</span>
                         <div className="flex gap-1">
                           <button onClick={() => updateClass(/flex-(row|col)/, 'flex-row')} className={`p-1.5 rounded ${currentClasses.includes('flex-row') || !currentClasses.includes('flex-col') ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}><ArrowLeftRight size={14} /></button>
                           <button onClick={() => updateClass(/flex-(row|col)/, 'flex-col')} className={`p-1.5 rounded ${currentClasses.includes('flex-col') ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}><ArrowUpDown size={14} /></button>
                         </div>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-slate-500">Align</span>
                         <div className="flex gap-1">
                           {['items-start', 'items-center', 'items-end'].map(a => (
                             <button key={a} onClick={() => updateClass(/items-(start|center|end|stretch)/, a)} className={`w-6 h-6 flex items-center justify-center rounded border ${currentClasses.includes(a) ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                               <div className={`w-3 h-0.5 bg-current ${a === 'items-center' ? 'mx-auto' : a === 'items-end' ? 'ml-auto' : ''}`} />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-slate-500">Justify</span>
                         <div className="flex gap-1">
                           {['justify-start', 'justify-center', 'justify-between'].map(j => (
                             <button key={j} onClick={() => updateClass(/justify-(start|center|end|between|around)/, j)} className={`w-6 h-6 flex items-center justify-center rounded border ${currentClasses.includes(j) ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                               <div className={`w-3 h-0.5 bg-current ${j === 'justify-center' ? 'mx-auto' : ''}`} />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-slate-500">Gap</span>
                         <select 
                            className="bg-slate-900 border border-slate-700 rounded text-xs p-1 w-16 text-slate-300 outline-none"
                            onChange={(e) => updateClass(/gap-(\d+)/, `gap-${e.target.value}`)}
                            value={currentClasses.match(/gap-(\d+)/)?.[1] || '0'}
                          >
                            {[0,1,2,4,6,8,12,16].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                       </div>
                    </div>
                  )}

                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Width</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                        onChange={(e) => updateClass(/w-[\w-/]+/, e.target.value)}
                        value={currentClasses.match(/w-[\w-/]+/)?.[0] || 'w-auto'}
                      >
                        <option value="w-auto">Auto</option>
                        <option value="w-full">Full</option>
                        <option value="w-1/2">50%</option>
                        <option value="w-1/3">33%</option>
                        <option value="w-screen">Screen</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Height</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                        onChange={(e) => updateClass(/h-[\w-/]+/, e.target.value)}
                        value={currentClasses.match(/h-[\w-/]+/)?.[0] || 'h-auto'}
                      >
                        <option value="h-auto">Auto</option>
                        <option value="h-full">Full</option>
                        <option value="h-screen">Screen</option>
                        <option value="min-h-screen">Min Screen</option>
                        <option value="h-64">256px</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SPACING SECTION */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50 mb-2">
              <button onClick={() => toggleSection('spacing')} className="w-full flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <BoxSelect size={12} /> Spacing
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${openSections.spacing ? 'rotate-180' : ''}`} />
              </button>
              
              {openSections.spacing && (
                <div className="p-4 space-y-4">
                  <div>
                     <div className="flex justify-between text-xs text-slate-500 mb-2">
                       <span>Padding</span>
                       <span className="font-mono text-slate-300">{currentClasses.match(/p-(\d+)/)?.[1] || 0}</span>
                     </div>
                     <input 
                        type="range" min="0" max="16" step="1" 
                        value={parseInt(currentClasses.match(/p-(\d+)/)?.[1] || '0')}
                        onChange={(e) => updateClass(/p-(\d+)/, `p-${e.target.value}`)}
                        className="w-full accent-blue-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs text-slate-500 mb-2">
                       <span>Margin</span>
                       <span className="font-mono text-slate-300">{currentClasses.match(/m-(\d+)/)?.[1] || 0}</span>
                     </div>
                     <input 
                        type="range" min="0" max="16" step="1" 
                        value={parseInt(currentClasses.match(/m-(\d+)/)?.[1] || '0')}
                        onChange={(e) => updateClass(/m-(\d+)/, `m-${e.target.value}`)}
                        className="w-full accent-blue-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>
                </div>
              )}
            </div>

            {/* TYPOGRAPHY SECTION */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50 mb-2">
              <button onClick={() => toggleSection('typography')} className="w-full flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Type size={12} /> Typography
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${openSections.typography ? 'rotate-180' : ''}`} />
              </button>
              
              {openSections.typography && (
                <div className="p-3 space-y-4">
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                      onChange={(e) => updateClass(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/, e.target.value)}
                      value={currentClasses.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/)?.[0] || 'text-base'}
                    >
                      <option value="text-xs">XS</option>
                      <option value="text-sm">SM</option>
                      <option value="text-base">Base</option>
                      <option value="text-lg">LG</option>
                      <option value="text-xl">XL</option>
                      <option value="text-2xl">2XL</option>
                      <option value="text-4xl">4XL</option>
                      <option value="text-6xl">6XL</option>
                    </select>

                    <select 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                      onChange={(e) => updateClass(/font-(thin|light|normal|medium|semibold|bold|extrabold|black)/, e.target.value)}
                      value={currentClasses.match(/font-(thin|light|normal|medium|semibold|bold|extrabold|black)/)?.[0] || 'font-normal'}
                    >
                      <option value="font-light">Light</option>
                      <option value="font-normal">Normal</option>
                      <option value="font-medium">Medium</option>
                      <option value="font-bold">Bold</option>
                      <option value="font-black">Black</option>
                    </select>
                  </div>

                  {/* Alignment & Decoration */}
                  <div className="flex justify-between items-center bg-slate-950 p-1 rounded border border-slate-800">
                    <div className="flex">
                       {['text-left', 'text-center', 'text-right'].map(cls => (
                          <button 
                            key={cls}
                            onClick={() => updateClass(/text-(left|center|right|justify)/, cls)}
                            className={`p-1.5 rounded transition-colors ${currentClasses.includes(cls) ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {cls === 'text-left' && <AlignLeft size={14} />}
                            {cls === 'text-center' && <AlignCenter size={14} />}
                            {cls === 'text-right' && <AlignRight size={14} />}
                          </button>
                       ))}
                    </div>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <div className="flex">
                        <button onClick={() => updateClass(/uppercase|lowercase|capitalize|normal-case/, 'uppercase')} className={`p-1.5 rounded text-[10px] font-bold ${currentClasses.includes('uppercase') ? 'text-blue-400' : 'text-slate-500'}`}>AA</button>
                        <button onClick={() => updateClass(/italic|not-italic/, currentClasses.includes('italic') ? 'not-italic' : 'italic')} className={`p-1.5 rounded ${currentClasses.includes('italic') ? 'text-blue-400' : 'text-slate-500'}`}><Italic size={14} /></button>
                        <button onClick={() => updateClass(/underline|no-underline/, currentClasses.includes('underline') ? 'no-underline' : 'underline')} className={`p-1.5 rounded ${currentClasses.includes('underline') ? 'text-blue-400' : 'text-slate-500'}`}><Underline size={14} /></button>
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="text-xs text-slate-500 mb-2 block">Color</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['text-white', 'text-slate-900', 'text-slate-400', 'text-blue-500', 'text-sky-400', 'text-indigo-500', 'text-purple-500', 'text-pink-500', 'text-red-500', 'text-orange-500', 'text-yellow-400', 'text-green-500', 'text-teal-400'].map(cls => (
                        <button
                          key={cls}
                          onClick={() => updateClass(/text-(white|black|slate-\d+|gray-\d+|red-\d+|orange-\d+|amber-\d+|yellow-\d+|lime-\d+|green-\d+|emerald-\d+|teal-\d+|cyan-\d+|sky-\d+|blue-\d+|indigo-\d+|violet-\d+|purple-\d+|fuchsia-\d+|pink-\d+|rose-\d+)/, cls)}
                          className={`w-5 h-5 rounded-full border border-slate-700/50 ${cls.replace('text-', 'bg-')} hover:scale-110 transition-transform ${currentClasses.includes(cls) ? 'ring-2 ring-white/20' : ''}`}
                          title={cls}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* APPEARANCE SECTION */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50 mb-2">
              <button onClick={() => toggleSection('appearance')} className="w-full flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <PaintBucket size={12} /> Appearance
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${openSections.appearance ? 'rotate-180' : ''}`} />
              </button>
              
              {openSections.appearance && (
                <div className="p-3 space-y-4">
                  {/* Background Color */}
                  <div>
                     <label className="text-xs text-slate-500 mb-2 block">Background Color</label>
                     <div className="grid grid-cols-7 gap-1.5">
                       {['bg-transparent', 'bg-white', 'bg-slate-950', 'bg-slate-900', 'bg-slate-800', 'bg-blue-600', 'bg-blue-500', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-red-500', 'bg-orange-500', 'bg-green-600', 'bg-teal-600'].map((cls) => (
                        <button
                          key={cls}
                          onClick={() => updateClass(/bg-[\w-]+/, cls)}
                          className={`w-6 h-6 rounded border ${currentClasses.includes(cls) ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-700'} ${cls === 'bg-transparent' ? 'bg-slash' : cls}`}
                          style={cls === 'bg-transparent' ? { backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '6px 6px', backgroundColor: '#1e293b' } : {}}
                          title={cls}
                        />
                      ))}
                     </div>
                  </div>

                  {/* Background Image */}
                  <div>
                    <label className="text-xs text-slate-500 mb-2 block flex items-center justify-between">
                      <span className="flex items-center gap-2"><ImageIcon size={12} /> Background Image</span>
                      <button onClick={() => document.getElementById('bg-upload')?.click()} className="text-blue-400 text-[10px] hover:text-white">Upload</button>
                    </label>
                    <div className="flex gap-2">
                       <input 
                         type="text"
                         placeholder="https://..."
                         value={currentStyles.backgroundImage?.replace(/^url\(['"](.+)['"]\)$/, '$1') || ''}
                         onChange={(e) => updateStyle('backgroundImage', e.target.value ? `url('${e.target.value}')` : '')}
                         className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                       />
                       <input 
                         id="bg-upload"
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={(e) => handleFileUpload(e, 'backgroundImage')}
                       />
                       {currentStyles.backgroundImage && (
                          <button onClick={() => updateStyle('backgroundImage', '')} className="text-red-400 hover:bg-red-900/20 p-1.5 rounded">
                            <X size={14} />
                          </button>
                       )}
                    </div>
                  </div>

                  {/* Borders & Roundness */}
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="text-xs text-slate-500 mb-1 block">Radius</label>
                       <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                        onChange={(e) => updateClass(/rounded(-[\w]+)?/, e.target.value)}
                        value={currentClasses.match(/rounded(-[\w]+)?/)?.[0] || 'rounded-none'}
                      >
                        <option value="rounded-none">None</option>
                        <option value="rounded-sm">Small</option>
                        <option value="rounded">Base</option>
                        <option value="rounded-lg">Large</option>
                        <option value="rounded-xl">XL</option>
                        <option value="rounded-2xl">2XL</option>
                        <option value="rounded-full">Full</option>
                      </select>
                     </div>
                     <div>
                       <label className="text-xs text-slate-500 mb-1 block">Border Width</label>
                       <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                        onChange={(e) => updateClass(/border(-[\w]+)?/, e.target.value)}
                        value={currentClasses.match(/border(-[\w]+)?/)?.[0] || 'border-none'}
                      >
                        <option value="border-none">None</option>
                        <option value="border">Thin</option>
                        <option value="border-2">Thick</option>
                        <option value="border-4">Heavy</option>
                      </select>
                     </div>
                  </div>

                   {/* Border Color */}
                  <div>
                    <label className="text-xs text-slate-500 mb-2 block">Border Color</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['border-slate-700', 'border-white', 'border-blue-500', 'border-red-500', 'border-green-500', 'border-yellow-400'].map(cls => (
                        <button
                          key={cls}
                          onClick={() => updateClass(/border-(slate-\d+|white|black|blue-\d+|red-\d+|green-\d+|yellow-\d+)/, cls)}
                          className={`w-5 h-5 rounded-full border border-slate-700/50 ${cls.replace('border-', 'bg-')} hover:scale-110 transition-transform ${currentClasses.includes(cls) ? 'ring-2 ring-white/20' : ''}`}
                          title={cls}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Effects */}
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="text-xs text-slate-500 mb-1 block">Shadow</label>
                       <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                        onChange={(e) => updateClass(/shadow(-[\w]+)?/, e.target.value)}
                        value={currentClasses.match(/shadow(-[\w]+)?/)?.[0] || 'shadow-none'}
                      >
                        <option value="shadow-none">None</option>
                        <option value="shadow-sm">Small</option>
                        <option value="shadow">Base</option>
                        <option value="shadow-lg">Large</option>
                        <option value="shadow-xl">XL</option>
                        <option value="shadow-2xl">2XL</option>
                      </select>
                     </div>
                     <div>
                       <label className="text-xs text-slate-500 mb-1 block">Opacity</label>
                       <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-slate-300 outline-none"
                        onChange={(e) => updateClass(/opacity-\d+/, e.target.value)}
                        value={currentClasses.match(/opacity-\d+/)?.[0] || 'opacity-100'}
                      >
                        <option value="opacity-100">100%</option>
                        <option value="opacity-75">75%</option>
                        <option value="opacity-50">50%</option>
                        <option value="opacity-25">25%</option>
                      </select>
                     </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Custom CSS */}
             <div className="pt-2">
                <details className="group">
                  <summary className="text-xs font-semibold text-slate-500 cursor-pointer hover:text-blue-400 transition-colors list-none flex items-center gap-2">
                    <span className="group-open:rotate-90 transition-transform">▸</span> Custom CSS Classes
                  </summary>
                   <textarea
                    value={element.props.className || ''}
                    onChange={(e) => handleChange('className', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-800 bg-slate-950 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono text-slate-300 h-20"
                  />
                </details>
             </div>

          </div>
        )}

        {/* ================= CONTENT TAB ================= */}
        {activeTab === 'content' && (
           <div className="p-4 space-y-5">
              
              {(element.type === 'heading' || element.type === 'text' || element.type === 'button') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text Content</label>
                     {renderAiAssist('text')}
                  </div>
                  <textarea
                    value={element.props.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-200 min-h-[120px] leading-relaxed"
                  />
                </div>
              )}

              {element.type === 'adsense-unit' && (
                <div className="space-y-4">
                   <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 mb-4">
                      <DollarSign className="text-green-500" size={16} />
                      <span className="text-xs text-green-300">AdSense Integration Active</span>
                   </div>
                   
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Slot ID</label>
                     <input
                       type="text"
                       value={element.props.slotId || ''}
                       onChange={(e) => handleChange('slotId', e.target.value)}
                       className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm text-slate-200 font-mono"
                       placeholder="1234567890"
                     />
                     <p className="text-[10px] text-slate-500 mt-1">Found in your AdSense dashboard when creating a new ad unit.</p>
                   </div>

                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Ad Format</label>
                     <select 
                        value={element.props.format || 'auto'}
                        onChange={(e) => handleChange('format', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm text-slate-200"
                     >
                       <option value="auto">Auto</option>
                       <option value="rectangle">Rectangle</option>
                       <option value="horizontal">Horizontal</option>
                       <option value="vertical">Vertical</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Layout Key (Optional)</label>
                     <input
                       type="text"
                       value={element.props.layoutKey || ''}
                       onChange={(e) => handleChange('layoutKey', e.target.value)}
                       className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm text-slate-200 font-mono"
                       placeholder="-gw-3+1f-3+2z"
                     />
                     <p className="text-[10px] text-slate-500 mt-1">Used for In-feed ads.</p>
                   </div>
                </div>
              )}

              {element.type === 'card' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-500">Title</label>
                      {renderAiAssist('title')}
                    </div>
                    <input
                      type="text"
                      value={element.props.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm font-bold text-slate-200"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-500">Content</label>
                      {renderAiAssist('content')}
                    </div>
                    <textarea
                      value={element.props.content || ''}
                      onChange={(e) => handleChange('content', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 h-24 resize-none"
                    />
                  </div>
                </div>
              )}

              {(element.type === 'image' || element.type === 'video' || element.type === 'iframe') && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source URL</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-white"
                    >
                      <Upload size={10} /> Upload File
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept={element.type === 'video' ? "video/*" : "image/*"}
                      onChange={(e) => handleFileUpload(e, 'src')}
                    />
                  </div>
                  <input
                    type="text"
                    value={element.props.src || ''}
                    onChange={(e) => handleChange('src', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-200"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-slate-600 mt-2">
                    {element.type === 'iframe' 
                      ? "Supported: Maps, YouTube Embeds, Wikipedia, etc."
                      : "Paste a direct link or upload a local file."}
                  </p>
                </div>
              )}

              {element.type === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-500">Headline</label>
                      {renderAiAssist('title')}
                    </div>
                    <input
                      type="text"
                      value={element.props.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm font-bold text-slate-200"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-500">Subtitle</label>
                      {renderAiAssist('subtitle')}
                    </div>
                    <textarea
                      value={element.props.subtitle || ''}
                      onChange={(e) => handleChange('subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 h-20"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-500">Button Label</label>
                      {renderAiAssist('buttonText')}
                    </div>
                    <input
                      type="text"
                      value={element.props.buttonText || ''}
                      onChange={(e) => handleChange('buttonText', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200"
                    />
                  </div>
                </div>
              )}

               {element.type === 'input' && (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Placeholder</label>
                  <input
                    type="text"
                    value={element.props.placeholder || ''}
                    onChange={(e) => handleChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-200"
                  />
                </div>
              )}

              {/* Helper for Icons/Buttons in the future */}
              <div className="pt-4 border-t border-slate-800 mt-4">
                 <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> AI Tips
                    </h4>
                    <p className="text-[11px] text-blue-300/80 leading-relaxed">
                       Use the magic wand button to instantly rewrite text. The AI is aware of your entire project structure and any files you uploaded in settings.
                    </p>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

const ArrowRightIcon = ({ size }: { size: number }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
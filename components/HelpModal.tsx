import React, { useState } from 'react';
import { X, Keyboard, Zap, Layout, HelpCircle, Code2, MousePointer2, Box, Type, Image, Video, Globe, DollarSign, Newspaper, FormInput, Megaphone, Heading1 } from 'lucide-react';
import { COMPONENT_PALETTE } from '../constants';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'start' | 'components' | 'shortcuts' | 'advanced'>('start');

  if (!isOpen) return null;

  const renderComponentIcon = (type: string) => {
    switch(type) {
      case 'container': return <Box size={20} />;
      case 'heading': return <Heading1 size={20} />;
      case 'text': return <Type size={20} />;
      case 'button': return <MousePointer2 size={20} />;
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      case 'iframe': return <Globe size={20} />;
      case 'card': return <DollarSign size={20} />; // Using generic icon
      case 'blog-grid': return <Newspaper size={20} />;
      case 'input': return <FormInput size={20} />;
      case 'adsense-unit': return <Megaphone size={20} />;
      default: return <Box size={20} />;
    }
  };

  const getComponentDesc = (type: string) => {
    switch(type) {
      case 'container': return "The fundamental building block. Use flexbox/grid classes to layout children. Can be nested infinitely.";
      case 'heading': return "Large typography for titles. Supports H1-H6 semantics via properties.";
      case 'text': return "Standard paragraph text. Supports rich styling and AI rewriting.";
      case 'button': return "Clickable action element. Styleable with background colors and hover effects.";
      case 'image': return "Embeds an image via URL. Supports object-fit and border radius.";
      case 'video': return "Native HTML5 video player for MP4/WebM files.";
      case 'iframe': return "Embed external content like Maps, YouTube, or other webpages.";
      case 'card': return "A pre-styled card component with title and content areas. Good for features or pricing.";
      case 'blog-grid': return "Dynamically renders your published CMS posts in a responsive grid layout.";
      case 'input': return "A form input field. Useful for prototyping contact forms.";
      case 'adsense-unit': return "Placeholders for Google AdSense ads. Requires Publisher ID in Settings.";
      default: return "A UI element.";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden max-h-[85vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
               <HelpCircle size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white">Documentation & Help</h2>
               <p className="text-sm text-slate-400">Guides, references, and tips for building faster.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 shrink-0 overflow-x-auto">
          {[
            { id: 'start', label: 'Quick Start' },
            { id: 'components', label: 'Component Library' },
            { id: 'shortcuts', label: 'Keyboard Shortcuts' },
            { id: 'advanced', label: 'Pro Features' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-400 bg-slate-800/50' 
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-950">
          
          {/* QUICK START TAB */}
          {activeTab === 'start' && (
             <div className="space-y-8 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                        <Layout size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">1. The Canvas</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        The center area is your workspace. It represents the live React DOM tree. You can drag elements from the left palette and drop them here.
                      </p>
                   </div>
                   
                   <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                        <MousePointer2 size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">2. Selection & Edit</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Click any element to select it. The <strong>Properties Panel</strong> on the right will open. Here you can adjust colors, spacing, and typography using visual controls.
                      </p>
                   </div>

                   <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center mb-4">
                        <Code2 size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">3. Style with Tailwind</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Nexcore is built on Tailwind CSS. Every visual change updates the <code>className</code> prop. You can also manually type classes in the "Custom CSS" dropdown.
                      </p>
                   </div>

                   <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="w-10 h-10 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center justify-center mb-4">
                        <Zap size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">4. Deploy</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        When ready, click "Export Source" to download a standard Vite + React project, ready to deploy to Netlify, Vercel, or any static host.
                      </p>
                   </div>
                </div>

                <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                   <h3 className="font-bold text-white mb-2">Pro Tip: Building Layouts</h3>
                   <p className="text-slate-400 text-sm">
                      To create columns (like a 3-column feature section), drop a <strong>Container</strong> element. In the Properties Panel, set its Display to <strong>Grid</strong> or <strong>Flex</strong>. Then drop 3 items inside it.
                   </p>
                </div>
             </div>
          )}

          {/* COMPONENTS TAB */}
          {activeTab === 'components' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPONENT_PALETTE.map((comp) => (
                <div key={comp.type} className="flex items-start gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                    {renderComponentIcon(comp.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{comp.label}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {getComponentDesc(comp.type)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SHORTCUTS TAB */}
          {activeTab === 'shortcuts' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-slate-800">
                       <tr>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Shortcut</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                       <tr>
                          <td className="p-4 text-slate-300 text-sm">Delete Selected Element</td>
                          <td className="p-4 text-right"><kbd className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">Delete</kbd></td>
                       </tr>
                       <tr>
                          <td className="p-4 text-slate-300 text-sm">Clear Selection</td>
                          <td className="p-4 text-right"><kbd className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">Esc</kbd></td>
                       </tr>
                       <tr>
                          <td className="p-4 text-slate-300 text-sm">Save Project</td>
                          <td className="p-4 text-right">
                             <kbd className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">Ctrl</kbd> + <kbd className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">S</kbd>
                          </td>
                       </tr>
                       <tr>
                          <td className="p-4 text-slate-300 text-sm">Navigate Up/Down</td>
                          <td className="p-4 text-right">
                            <kbd className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">↑</kbd> / <kbd className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">↓</kbd>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
             <div className="space-y-8 max-w-3xl mx-auto">
                <div className="flex gap-6">
                   <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl h-fit border border-yellow-500/20"><Zap size={24} /></div>
                   <div>
                      <h4 className="text-lg font-bold text-white mb-2">AI Copilot Integration</h4>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">
                         Nexcore can connect to your own API keys for Google Gemini, OpenAI, or Anthropic. This enables:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
                         <li><strong>Generative Layouts:</strong> Click "Generate with AI" in the sidebar to build entire sections from a text prompt.</li>
                         <li><strong>Smart Copywriting:</strong> Use the "Magic Wand" icon next to any text field in the properties panel to rewrite, shorten, or fix grammar.</li>
                         <li><strong>Context Aware:</strong> Upload your brand guidelines in the Settings > Knowledge Base tab, and the AI will reference them.</li>
                      </ul>
                   </div>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="flex gap-6">
                   <div className="p-3 bg-red-500/10 text-red-400 rounded-xl h-fit border border-red-500/20"><Layout size={24} /></div>
                   <div>
                      <h4 className="text-lg font-bold text-white mb-2">Headless CMS</h4>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">
                         Built-in content management for blogs and dynamic data.
                      </p>
                      <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
                         <li>Go to the <strong>Content</strong> tab in the sidebar.</li>
                         <li>Create posts with title, date, author, and content.</li>
                         <li>In the Builder, drop a <strong>Blog Grid</strong> component. It automatically fetches and displays your published posts.</li>
                      </ul>
                   </div>
                </div>
             </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 text-center">
           <a href="#" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">View full documentation online →</a>
        </div>
      </div>
    </div>
  );
};

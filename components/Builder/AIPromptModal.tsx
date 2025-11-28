import React, { useState } from 'react';
import { SiteElement, AIConfig } from '../../types';
import { generateLayout } from '../../utils/aiService';
import { Sparkles, X, Loader2, Info } from 'lucide-react';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (elements: SiteElement[]) => void;
  config: AIConfig;
  systemContext: string;
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  config,
  systemContext 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    if (!config.apiKey && config.provider !== 'custom') {
        setError("Please configure an API Key in settings first.");
        return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const elements = await generateLayout(config, prompt, systemContext);
      onGenerate(elements);
      onClose();
      setPrompt('');
    } catch (err) {
      setError("Failed to generate layout. Please try a different description.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Sparkles className="text-blue-500" />
               Generate with AI
             </h2>
             <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
               <X size={24} />
             </button>
          </div>

          <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Describe what you want to build</label>
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                 placeholder="e.g., A pricing section with 3 cards, dark theme, and a 'Most Popular' badge on the middle card."
                 autoFocus
               />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
                <Info size={16} /> {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
               <button 
                 onClick={onClose}
                 className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSubmit}
                 disabled={isGenerating || !prompt.trim()}
                 className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all ${
                    isGenerating ? 'opacity-70 cursor-wait' : 'hover:bg-blue-500'
                 }`}
               >
                 {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                 {isGenerating ? 'Designing...' : 'Generate Layout'}
               </button>
            </div>
          </div>
        </div>
        
        {/* Tips Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex gap-4 text-xs text-slate-500">
           <span className="font-bold uppercase tracking-wider text-slate-400">Tips:</span>
           <ul className="flex gap-4 list-disc list-inside">
              <li>Be specific about colors ("dark blue background")</li>
              <li>Mention layout ("3 column grid")</li>
              <li>Ask for standard sections ("FAQ", "Testimonials")</li>
           </ul>
        </div>
      </div>
    </div>
  );
};
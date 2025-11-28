import React from 'react';
import { Template } from '../types';
import { TEMPLATES } from '../constants';
import { X, Layout, CheckCircle } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-800 relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Start a New Project</h2>
            <p className="text-slate-400">Choose a template to jumpstart your design.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id}
                className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col h-full"
              >
                {/* Preview Placeholder */}
                <div className="h-48 bg-slate-800 relative overflow-hidden group-hover:bg-slate-800/80 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105">
                     <Layout size={48} className="text-blue-500" />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 right-4 h-2 bg-slate-700 rounded-full opacity-20" />
                  <div className="absolute top-8 left-4 w-1/2 h-2 bg-slate-700 rounded-full opacity-20" />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                    {template.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => onSelect(template)}
                      className="w-full py-3 bg-slate-800 text-white rounded-lg font-medium border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
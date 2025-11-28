import React, { useState } from 'react';
import { Course } from '../types';
import { ChevronRight, ChevronLeft, GraduationCap, X, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CourseGuideProps {
  course: Course;
  onClose: () => void;
}

export const CourseGuide: React.FC<CourseGuideProps> = ({ course, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const step = course.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / course.totalSteps) * 100;

  const handleNext = () => {
    if (currentStepIndex < course.totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-bottom-10">
        <button 
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-500 transition-transform hover:scale-105 font-bold"
        >
          <GraduationCap size={20} />
          <span>Resume Course</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-full max-w-sm animate-in fade-in slide-in-from-bottom-10">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap size={20} className="text-blue-400" />
            <div>
              <h3 className="text-sm font-bold leading-tight">{course.title}</h3>
              <p className="text-[10px] text-blue-200 opacity-80">Step {currentStepIndex + 1} of {course.totalSteps}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Minimize">
              <span className="sr-only">Minimize</span>
              <div className="w-3 h-0.5 bg-current" />
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Exit Course">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <h2 className="text-xl font-bold text-white mb-4">{step.title}</h2>
          
          <div 
            className="prose prose-invert prose-sm text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: step.content }} 
          />

          {step.hint && (
            <div className="mt-6 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg flex gap-3 text-xs text-blue-200">
              <HelpCircle size={16} className="shrink-0 mt-0.5" />
              <p>{step.hint}</p>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
          <button 
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${currentStepIndex === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {currentStepIndex === course.totalSteps - 1 ? (
             <button 
               onClick={onClose}
               className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-900/20 transition-all"
             >
               <CheckCircle2 size={16} /> Finish
             </button>
          ) : (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all group"
            >
              Next Step <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
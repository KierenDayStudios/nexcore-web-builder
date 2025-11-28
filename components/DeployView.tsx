import React, { useState } from 'react';
import { Github, Cloud, CheckCircle2, GitCommit, Play, Clock, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { SiteElement, BlogPost } from '../types';
import { downloadProjectZip } from '../utils/projectGenerator';

interface DeployViewProps {
  elements: SiteElement[];
  posts: readonly BlogPost[];
}

export const DeployView: React.FC<DeployViewProps> = ({ elements, posts }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const startDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);
    
    // Simulate steps
    setTimeout(() => setDeployStep(2), 1500); // Building
    setTimeout(() => {
        setDeployStep(3); // Uploading
    }, 3500); 
    setTimeout(() => {
        setDeployStep(4); // Live
        // Auto-download as part of the "Build" process to make it feel real
        downloadProjectZip(elements, posts);
    }, 4500); 
  };

  const handleDownload = () => {
    downloadProjectZip(elements, posts);
  };

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Deployment Center</h1>
            <p className="text-slate-400 mt-2">Manage Git integration and production builds.</p>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={handleDownload}
              className="px-4 py-2 border border-slate-700 bg-slate-900 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600 font-medium flex items-center gap-2 transition-all"
            >
              <Download size={18} />
              <span>Download ZIP</span>
            </button>
            <button 
              onClick={startDeploy}
              disabled={isDeploying && deployStep < 4}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-white transition-all shadow-lg ${
                isDeploying && deployStep < 4 
                  ? 'bg-blue-900/50 cursor-not-allowed text-blue-300' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
              }`}
            >
              {isDeploying && deployStep < 4 ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Cloud size={18} />
                  <span>{deployStep === 4 ? 'Redeploy' : 'Deploy to Production'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Export Info Box */}
        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start backdrop-blur-sm">
           <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 shrink-0 ring-1 ring-blue-500/20">
             <Github size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-blue-100 mb-2">How to deploy from here?</h3>
             <p className="text-blue-300/80 text-sm leading-relaxed mb-4">
               Since this builder runs in your browser, we can't directly push to your private GitHub yet. 
               The professional workflow is:
             </p>
             <ol className="list-decimal list-inside text-blue-300/80 text-sm space-y-1 mb-4 font-mono">
               <li>Click <strong className="text-blue-200">Deploy</strong> or <strong className="text-blue-200">Download ZIP</strong> to get the codebase.</li>
               <li>Unzip and push the code to a new GitHub repo.</li>
               <li>Connect that repository to Netlify/Vercel.</li>
             </ol>
             <a href="#" onClick={handleDownload} className="text-blue-400 font-semibold text-sm hover:text-blue-300 flex items-center gap-1 group">
               Download Source Code <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </a>
           </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] ${deployStep === 4 ? 'bg-green-500 shadow-green-500/50' : 'bg-slate-600'}`} />
            Deployment Pipeline Simulation
          </h2>

          <div className="space-y-8 relative">
             {/* Connector Line */}
             <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-800" />

            {/* Step 1: Git */}
            <div className={`flex gap-4 relative ${deployStep >= 1 || !isDeploying ? 'opacity-100' : 'opacity-40'}`}>
              <div className="mt-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${deployStep >= 1 ? 'bg-slate-900 border-green-500 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
                   {deployStep >= 1 ? <CheckCircle2 size={16} /> : <GitCommit size={16} />}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Commit & Push</h3>
                <p className="text-slate-500 text-sm">Syncing local changes to origin/main</p>
              </div>
            </div>

             {/* Step 2: Build */}
             <div className={`flex gap-4 relative ${deployStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="mt-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${deployStep >= 2 ? 'bg-slate-900 border-green-500 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
                   {deployStep >= 2 ? <CheckCircle2 size={16} /> : <Play size={16} />}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Build Process</h3>
                <p className="text-slate-500 text-sm">Running 'npm run build' (Vite)</p>
              </div>
            </div>

            {/* Step 3: Live */}
             <div className={`flex gap-4 relative ${deployStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="mt-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${deployStep >= 4 ? 'bg-slate-900 border-green-500 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
                   {deployStep >= 4 ? <CheckCircle2 size={16} /> : <Cloud size={16} />}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Live Deployment</h3>
                <p className="text-slate-500 text-sm">
                    {deployStep === 4 ? "Build complete. Source code downloaded." : "Waiting for build..."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
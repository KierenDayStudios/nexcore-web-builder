import React, { useState, useEffect } from 'react';
import { 
  Layers, Code2, Globe, ArrowRight, 
  Terminal, MousePointer2, Sparkles, Hexagon,
  Palette, ArrowLeft, Shield, Lock, 
  Book, Server, Database, Layout, Key, GitBranch,
  Cpu, Zap, CheckCircle2, FileJson, FastForward,
  MonitorSmartphone, Component, Download, GraduationCap, PlayCircle, Star
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

// --- ANIMATION STYLES ---
const style = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .perspective-1000 {
    perspective: 1000px;
  }
  .rotate-x-12 {
    transform: rotateX(12deg) rotateY(-4deg) rotateZ(2deg);
  }
  .bg-grid-slate {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(30, 41, 59, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(30, 41, 59, 0.1) 1px, transparent 1px);
  }
  .text-glow {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  .glass-nav {
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
`;

type ViewState = 'home' | 'docs' | 'privacy';

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [view, setView] = useState<ViewState>('home');
  const [scrolled, setScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'visual' | 'code'>('visual');

  // Handle Scroll Effect for Nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNav = (active: string) => (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center px-6 justify-between">
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setView('home')}
      >
        {/* Small White Logo */}
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Nexcore Web Builder <span className="text-slate-500 font-mono text-sm font-normal ml-2">{active}</span></span>
      </div>
      <div className="flex items-center gap-6">
         {active !== 'home' && (
           <button onClick={() => setView('home')} className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft size={16} /> Back to Home
           </button>
         )}
      </div>
    </nav>
  );

  // --- DOCUMENTATION VIEW ---
  if (view === 'docs') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
        {renderNav('docs')}
        
        <div className="max-w-4xl mx-auto py-16 px-6">
           <div className="mb-12 border-b border-slate-800 pb-8">
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Documentation</h1>
             <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
               Learn how to build, manage, and deploy modern web applications using the Nexcore Web Builder hybrid engine.
             </p>
           </div>

           <div className="space-y-16">
              {/* Section 1 */}
              <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-blue-500">
                      <Layout size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">The Hybrid Builder</h2>
                 </div>
                 <div className="prose prose-invert prose-slate max-w-none prose-a:text-blue-400">
                    <p>
                      Nexcore Web Builder uses a unique "Hybrid" engine. Unlike traditional site builders that trap you in proprietary formats, Nexcore manipulates a real React Component Tree.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                       <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Palette size={16} /> Visual Mode</h4>
                          <p className="text-sm text-slate-400">Drag and drop elements. Use the properties panel to apply Tailwind utility classes visually.</p>
                       </div>
                       <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Code2 size={16} /> Code Mode</h4>
                          <p className="text-sm text-slate-400">Click the "Code" toggle to see raw JSX. This code is read-only but represents the exact export output.</p>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Section 2 */}
              <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-blue-500">
                      <Sparkles size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">AI Copilot</h2>
                 </div>
                 <div className="prose prose-invert prose-slate max-w-none">
                    <p>
                      The integrated AI assistant is context-aware. It understands your entire project structure, installed pages, and uploaded knowledge files.
                    </p>
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 mt-6">
                       <h4 className="font-bold text-blue-100 mb-2">Workflow</h4>
                       <ol className="list-decimal pl-5 space-y-2 text-blue-200/70">
                          <li><strong>Generate Layouts:</strong> Click "Generate Section" in the sidebar. Describe what you want.</li>
                          <li><strong>Refine Copy:</strong> Select text elements and use the <Sparkles size={12} className="inline" /> icon in the properties panel.</li>
                          <li><strong>Context:</strong> Upload brand guidelines in Settings to train the AI on your voice.</li>
                       </ol>
                    </div>
                 </div>
              </section>

              {/* Section 3 */}
              <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-blue-500">
                      <Database size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Headless CMS</h2>
                 </div>
                 <div className="prose prose-invert prose-slate max-w-none">
                    <p>
                      Nexcore Web Builder includes a lightweight, JSON-based CMS for managing dynamic content like Blog Posts or Portfolios.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-400">
                       <li>Manage content in the <strong>Content</strong> tab.</li>
                       <li>Use the <strong>Blog Grid</strong> component to render posts.</li>
                       <li>Data is exported as static JSON for zero-latency loading.</li>
                    </ul>
                 </div>
              </section>
           </div>
           
           <div className="mt-20 pt-10 border-t border-slate-800 flex justify-between items-center">
              <p className="text-slate-500">Ready to build?</p>
              <button onClick={onEnter} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20">
                Launch Builder
              </button>
           </div>
        </div>
        
        {/* Footer */}
        <footer className="py-12 px-6 bg-slate-950 border-t border-slate-900 mt-auto">
            <div className="max-w-7xl mx-auto flex justify-center items-center text-sm text-slate-500">
               <button onClick={() => setView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            </div>
        </footer>
      </div>
    );
  }

  // --- PRIVACY POLICY VIEW ---
  if (view === 'privacy') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
        {renderNav('privacy')}
        
        <div className="max-w-3xl mx-auto py-16 px-6">
           <div className="mb-12 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 mb-6 border border-blue-500/20">
                <Lock size={32} />
             </div>
             <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Privacy First Architecture</h1>
             <p className="text-lg text-slate-400">
               Nexcore Web Builder is architected to be local-first. Your data belongs to you, not our servers.
             </p>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                   <Server size={20} className="text-blue-500" />
                   Local Execution
                </h3>
                <p className="text-slate-400 leading-relaxed">
                   Nexcore operates entirely as a <strong>Client-Side Application</strong>. Your project structure, content, and images are stored in your browser's memory and Local Storage. We do not transmit your source code to our backend.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                   <Key size={20} className="text-blue-500" />
                   API Key Security
                </h3>
                <p className="text-slate-400 leading-relaxed">
                   AI features require an API Key (Google Gemini, OpenAI, etc.). This key is <strong>saved locally in your browser</strong>. It is never sent to Nexcore servers. It communicates directly from your device to the AI provider.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                   <MousePointer2 size={20} className="text-blue-500" />
                   Zero Tracking
                </h3>
                <p className="text-slate-400 leading-relaxed">
                   We do not use tracking pixels, session recorders, or invasive analytics. Your workflow is private.
                </p>
              </div>
           </div>
        </div>
        
        {/* Footer */}
        <footer className="py-12 px-6 bg-slate-950 border-t border-slate-900 mt-auto">
            <div className="max-w-7xl mx-auto flex justify-center items-center text-sm text-slate-500">
               <button onClick={() => setView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            </div>
        </footer>
      </div>
    );
  }

  // --- HOME VIEW (LANDING) ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <style>{style}</style>
      
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Technical Grid */}
        <div className="absolute inset-0 bg-grid-slate opacity-[0.4]" />
        
        {/* Subtle Blue Glows - Branded */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px]" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'glass-nav border-slate-800/50 h-16' : 'bg-transparent border-transparent h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('home')}>
             {/* Simple White Logo */}
             <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
             </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-100 transition-colors">Nexcore Web Builder</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setView('docs')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                Documentation
              </button>
            </div>
            <button 
              onClick={onEnter}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 border border-blue-500"
            >
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 Live
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Build the web <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 text-glow">without limits.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            The hybrid visual editor for professional developers. 
            Drag, drop, and export clean, production-ready React code.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto">
            <button 
              onClick={onEnter}
              className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-all w-full md:w-auto overflow-hidden shadow-2xl shadow-blue-900/20"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <div className="flex items-center justify-center gap-2">
                 Launch Editor <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* 3D Interface Preview - Branded to Blue/Slate */}
          <div className="mt-24 perspective-1000 w-full max-w-6xl">
            <div className="relative group transition-all duration-700 transform hover:rotate-x-0 rotate-x-12 hover:scale-105">
               {/* Glow effect behind */}
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-30 transition duration-500" />
               
               {/* Main Window */}
               <div className="relative bg-[#020617] rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:h-[600px]">
                  {/* Window Bar */}
                  <div className="h-10 bg-[#0f172a] border-b border-slate-800 flex items-center px-4 justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                        <Globe size={10} /> localhost:3000
                     </div>
                     <div className="w-16" />
                  </div>

                  {/* App Content - Mimicking the actual App UI */}
                  <div className="flex-1 flex overflow-hidden">
                     {/* Sidebar Mockup */}
                     <div className="w-16 md:w-64 border-r border-slate-800 bg-slate-950 hidden md:flex flex-col p-4 gap-4">
                        <div className="flex items-center gap-3 text-slate-200 font-bold mb-4">
                           <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center"><Layers size={16} /></div>
                           <span>Layers</span>
                        </div>
                        {[1,2,3,4,5].map(i => (
                           <div key={i} className="h-8 w-full bg-slate-900 rounded border border-slate-800" />
                        ))}
                     </div>
                     
                     {/* Canvas Mockup */}
                     <div className="flex-1 bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-16">
                        <div className="absolute inset-0 bg-grid-slate opacity-20" />
                        
                        <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center text-center gap-6 group/canvas ring-4 ring-slate-800">
                           <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover/canvas:opacity-100 transition-opacity transform translate-y-2 group-hover/canvas:translate-y-0 font-mono">
                              BLOCK: HERO
                           </div>
                           <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                              <Zap size={32} fill="currentColor" />
                           </div>
                           <div className="space-y-3 w-full">
                              <div className="h-8 w-3/4 bg-slate-900 rounded mx-auto" />
                              <div className="h-4 w-1/2 bg-slate-400 rounded mx-auto" />
                           </div>
                           <div className="flex gap-4 mt-4">
                              <div className="h-10 w-32 bg-blue-600 rounded" />
                              <div className="h-10 w-32 bg-slate-100 rounded border border-slate-200" />
                           </div>
                        </div>

                        {/* Floating Tooltip */}
                        <div className="absolute top-1/4 right-1/4 bg-blue-600 text-white text-xs px-3 py-1.5 rounded shadow-xl flex items-center gap-2 animate-bounce font-mono">
                           <MousePointer2 size={12} fill="currentColor" /> User_1
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: DETAILED FEATURES LIST --- */}
      <section className="py-24 bg-slate-950 border-y border-slate-900">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {/* Visual Builder */}
               <div className="space-y-6">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500">
                     <Layout size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Visual Layout Engine</h3>
                  <ul className="space-y-4 text-slate-400 text-sm">
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Tailwind Native:</strong> Every drag, drop, and resize maps directly to utility classes.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Responsive Modes:</strong> Toggle between Desktop, Tablet, and Mobile views instantly.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Nested Components:</strong> Build complex layouts with infinite container nesting.</span>
                     </li>
                  </ul>
               </div>

               {/* Developer Experience */}
               <div className="space-y-6">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500">
                     <Terminal size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Developer Experience</h3>
                  <ul className="space-y-4 text-slate-400 text-sm">
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Zero Lock-in:</strong> Export standard Vite + React projects. No proprietary runtimes.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Clean JSX:</strong> The code generator produces human-readable, semantic markup.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Local First:</strong> Runs entirely in the browser. Your code never leaves your device.</span>
                     </li>
                  </ul>
               </div>

               {/* Integrated Tools */}
               <div className="space-y-6">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500">
                     <BoxIcon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Integrated Tools</h3>
                  <ul className="space-y-4 text-slate-400 text-sm">
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Headless CMS:</strong> Manage blog posts and dynamic content via JSON.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>AI Copilot:</strong> Generate copy and layouts using your own API keys (Gemini, OpenAI).</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>AdSense Ready:</strong> Drag & drop ad units for monetization out of the box.</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* --- VALUE PROP DEMO --- */}
      <section className="py-32 px-6 relative border-t border-slate-900 bg-slate-950">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                     <Cpu size={12} /> Hybrid Engine
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                     Think visually. <br />
                     <span className="text-blue-500">Code natively.</span>
                  </h2>
                  <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-slate-800 pl-6">
                     Switch between high-fidelity visual editing and raw code instantly. Nexcore Web Builder keeps your React components and visual canvas in perfect sync.
                  </p>
                  
                  <div className="space-y-4">
                     <div 
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${activeDemo === 'visual' ? 'bg-blue-900/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                        onClick={() => setActiveDemo('visual')}
                     >
                        <div className="flex items-center gap-3 mb-2">
                           <div className={`p-2 rounded-lg ${activeDemo === 'visual' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                              <Palette size={20} />
                           </div>
                           <h3 className="font-bold text-white">Visual Mode</h3>
                        </div>
                        <p className="text-sm text-slate-400 ml-11">Drag, drop, and style with Tailwind classes. No abstraction layers.</p>
                     </div>

                     <div 
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${activeDemo === 'code' ? 'bg-blue-900/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                        onClick={() => setActiveDemo('code')}
                     >
                        <div className="flex items-center gap-3 mb-2">
                           <div className={`p-2 rounded-lg ${activeDemo === 'code' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                              <Code2 size={20} />
                           </div>
                           <h3 className="font-bold text-white">Code Mode</h3>
                        </div>
                        <p className="text-sm text-slate-400 ml-11">Direct access to JSX/TSX. Edits reflect instantly on the canvas.</p>
                     </div>
                  </div>
               </div>

               {/* Interactive Window */}
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-[#020617] rounded-xl border border-slate-700 shadow-2xl h-[500px] flex flex-col overflow-hidden">
                     {/* Window Header */}
                     <div className="h-10 bg-[#0f172a] flex items-center justify-between px-4 border-b border-slate-800">
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-2"><FileCodeIcon size={12} /> Component.tsx</span>
                        <div className="flex gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                           <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        </div>
                     </div>
                     
                     {/* Content Switcher */}
                     <div className="flex-1 relative">
                        {/* Visual View */}
                        <div className={`absolute inset-0 bg-slate-900 transition-all duration-500 p-8 flex flex-col items-center justify-center ${activeDemo === 'visual' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                           <div className="w-full max-w-sm bg-white rounded shadow-xl p-6 transform hover:scale-105 transition-transform duration-300 ring-1 ring-slate-200">
                              <div className="h-4 w-1/3 bg-slate-200 rounded mb-4" />
                              <div className="h-8 w-3/4 bg-slate-900 rounded mb-2" />
                              <div className="h-20 w-full bg-slate-50 rounded mb-4 border border-slate-100" />
                              <div className="h-10 w-full bg-blue-600 rounded" />
                              
                              {/* Overlay UI Controls */}
                              <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg border border-blue-500">
                                 p-6
                              </div>
                              <div className="absolute top-1/2 -left-3 bg-blue-600 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg border border-blue-500">
                                 flex-col
                              </div>
                           </div>
                        </div>

                        {/* Code View */}
                        <div className={`absolute inset-0 bg-[#020617] transition-all duration-500 p-8 overflow-hidden font-mono text-sm leading-relaxed ${activeDemo === 'code' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                           <div className="space-y-1">
                              <div className="text-purple-400">export default function <span className="text-blue-300">Card</span>() {'{'}</div>
                              <div className="text-slate-400 pl-4">return (</div>
                              <div className="text-blue-400 pl-8">&lt;div <span className="text-purple-300">className</span>=<span className="text-green-400">"bg-white p-6 shadow-xl"</span>&gt;</div>
                              <div className="text-blue-400 pl-12">&lt;h2 <span className="text-purple-300">className</span>=<span className="text-green-400">"text-2xl font-bold mb-2"</span>&gt;</div>
                              <div className="text-slate-200 pl-16">Hello World</div>
                              <div className="text-blue-400 pl-12">&lt;/h2&gt;</div>
                              <div className="text-blue-400 pl-12">&lt;p <span className="text-purple-300">className</span>=<span className="text-green-400">"text-slate-600"</span>&gt;</div>
                              <div className="text-slate-200 pl-16">Start editing to see magic happen.</div>
                              <div className="text-blue-400 pl-12">&lt;/p&gt;</div>
                              <div className="text-blue-400 pl-12">&lt;button <span className="text-purple-300">className</span>=<span className="text-green-400">"bg-blue-600 text-white..."</span>&gt;</div>
                              <div className="text-slate-200 pl-16">Click Me</div>
                              <div className="text-blue-400 pl-12">&lt;/button&gt;</div>
                              <div className="text-blue-400 pl-8">&lt;/div&gt;</div>
                              <div className="text-slate-400 pl-4">);</div>
                              <div className="text-purple-400">{'}'}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- TECH STACK STRIP --- */}
      <section className="py-12 border-t border-slate-900 bg-slate-950/50">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Powered By Modern Standards</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
               <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                  <span className="text-blue-500"><Code2 size={24} /></span> React 19
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                  <span className="text-sky-500"><Palette size={24} /></span> Tailwind CSS
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                  <span className="text-yellow-500"><Zap size={24} /></span> Vite
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                  <span className="text-blue-600"><FileJson size={24} /></span> TypeScript
               </div>
            </div>
         </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-slate-900">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ship your next idea.</h2>
           <p className="text-xl text-slate-400 mb-10">Join thousands of developers building cleaner, faster websites with Nexcore Web Builder.</p>
           <button 
             onClick={onEnter}
             className="px-8 py-4 bg-white text-slate-950 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
           >
             Launch Builder Now
           </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-950 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto flex justify-center items-center text-sm text-slate-500">
              <button onClick={() => setView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
          </div>
      </footer>

    </div>
  );
};

// Helper for icon usage in the demo code
const FileCodeIcon = ({ size }: { size: number }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const BoxIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
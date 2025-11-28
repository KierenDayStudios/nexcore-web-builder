import React from 'react';
import { LayoutDashboard, PenTool, Settings, FileCode, Github, Globe } from 'lucide-react';

interface SidebarProps {
  activeTab: 'builder' | 'cms' | 'deploy' | 'settings';
  setActiveTab: (tab: 'builder' | 'cms' | 'deploy' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'builder', label: 'Builder', icon: PenTool },
    { id: 'cms', label: 'Content', icon: LayoutDashboard },
    { id: 'deploy', label: 'Deploy', icon: Globe },
  ] as const;

  return (
    <div className="w-16 md:w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full transition-all duration-300 z-50">
      {/* Brand */}
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
        <div className="relative group cursor-pointer flex items-center gap-3">
           {/* Simple White Logo: A rounded square with a center dot */}
           <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow">
              <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
           </div>
           <span className="font-bold text-lg text-white hidden lg:block tracking-tight">NEXCORE</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? "animate-pulse-once" : ""} />
            <span className="hidden lg:block font-medium">{item.label}</span>
            
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block shadow shadow-white/50" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'settings' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Settings size={20} />
          <span className="hidden lg:block text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 text-slate-500 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors">
          <Github size={20} />
          <span className="hidden lg:block text-sm">GitHub</span>
        </button>
      </div>
    </div>
  );
};
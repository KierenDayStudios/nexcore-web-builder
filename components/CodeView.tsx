import React, { useState, useMemo, useEffect } from 'react';
import { Page, BlogPost } from '../types';
import { Copy, Check, FileCode, FolderOpen, FileJson, FileType, StickyNote } from 'lucide-react';
import { generateProjectFiles } from '../utils/projectGenerator';

interface CodeViewProps {
  pages: Page[];
  posts: readonly BlogPost[];
}

export const CodeView: React.FC<CodeViewProps> = ({ pages, posts }) => {
  const [activeFile, setActiveFile] = useState<string>('src/App.jsx');
  const [copied, setCopied] = useState(false);

  // Generate files in real-time based on current state
  const files = useMemo(() => generateProjectFiles(pages, posts), [pages, posts]);
  
  // Ensure active file exists
  useEffect(() => {
    if (!files[activeFile]) {
      setActiveFile('src/App.jsx');
    }
  }, [files, activeFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile as keyof typeof files]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileIcons: Record<string, React.ReactNode> = {
    'package.json': <FileJson size={14} className="text-yellow-500" />,
    'vite.config.js': <FileType size={14} className="text-purple-500" />,
    'tailwind.config.js': <FileType size={14} className="text-teal-500" />,
    'index.html': <FileCode size={14} className="text-orange-500" />,
    'jsx': <FileCode size={14} className="text-blue-400" />,
    'css': <FileType size={14} className="text-blue-300" />,
  };

  return (
    <div className="flex-1 bg-slate-900 flex h-full overflow-hidden">
      
      {/* File Explorer Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Files</span>
        </div>
        <div className="p-2 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {/* Root Configs */}
          {['package.json', 'vite.config.js', 'tailwind.config.js', 'index.html'].map(file => (
             <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                activeFile === file ? 'bg-blue-900/30 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {fileIcons[file]}
              <span>{file}</span>
            </button>
          ))}
          
          {/* Src Folder */}
          <div className="mt-2">
            <div className="flex items-center gap-2 px-3 py-2 text-slate-500 text-sm">
              <FolderOpen size={14} />
              <span>src</span>
            </div>
            <div className="pl-4 space-y-1">
               {['src/App.jsx', 'src/main.jsx', 'src/index.css'].map(file => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    activeFile === file ? 'bg-blue-900/30 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {file.endsWith('css') ? fileIcons['css'] : fileIcons['jsx']}
                  <span>{file.split('/')[1]}</span>
                </button>
              ))}

              {/* Pages Folder */}
              <div className="mt-1">
                 <div className="flex items-center gap-2 px-2 py-1 text-slate-600 text-xs uppercase font-bold tracking-wider">
                    Pages
                 </div>
                 <div className="pl-2 space-y-1 mt-1">
                    {pages.map(p => {
                      const fileName = `src/pages/${p.name.replace(/\s+/g, '')}.jsx`;
                      return (
                        <button
                          key={fileName}
                          onClick={() => setActiveFile(fileName)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                            activeFile === fileName ? 'bg-blue-900/30 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <StickyNote size={14} className="text-blue-300" />
                          <span>{p.name.replace(/\s+/g, '')}.jsx</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
             <span className="opacity-50">nexcore-project /</span>
             <span className="text-slate-200">{activeFile}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700 transition-colors border border-slate-700"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto relative custom-scrollbar">
          <pre className="p-6 text-sm font-mono leading-relaxed">
            <code className="text-blue-100">
              {files[activeFile as keyof typeof files]}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
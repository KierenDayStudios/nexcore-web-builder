import React, { useState, useEffect, useRef } from 'react';
import { AIConfig, KnowledgeFile, Page, BlogPost, AIProvider, IntegrationsConfig } from '../../types';
import { generateSystemContext } from '../../utils/contextGenerator';
import { Save, Trash2, FileText, Upload, RefreshCw, Eye, EyeOff, Bot, BrainCircuit, Key, Cpu, Check, AlertCircle, ExternalLink, Settings, Globe, Megaphone, HardDrive, Download } from 'lucide-react';

interface AISettingsProps {
  config: AIConfig;
  onSaveConfig: (config: AIConfig) => void;
  knowledgeFiles: KnowledgeFile[];
  onAddFile: (file: KnowledgeFile) => void;
  onRemoveFile: (id: string) => void;
  pages: Page[];
  posts: readonly BlogPost[];
  integrations: IntegrationsConfig;
  onSaveIntegrations: (config: IntegrationsConfig) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const AISettings: React.FC<AISettingsProps> = ({ 
  config, 
  onSaveConfig, 
  knowledgeFiles, 
  onAddFile, 
  onRemoveFile,
  pages,
  posts,
  integrations,
  onSaveIntegrations,
  onExportBackup,
  onImportBackup
}) => {
  const [activeTab, setActiveTab] = useState<'connection' | 'knowledge' | 'context' | 'integrations' | 'data'>('connection');
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);
  const [localIntegrations, setLocalIntegrations] = useState<IntegrationsConfig>(integrations);
  const [showKey, setShowKey] = useState(false);
  const [liveContext, setLiveContext] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLiveContext(generateSystemContext(pages, posts));
  }, [pages, posts]);

  const handleSave = () => {
    onSaveConfig(localConfig);
    onSaveIntegrations(localIntegrations);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic text file validation
    if (!file.type.match('text.*') && !file.name.endsWith('.md') && !file.name.endsWith('.json')) {
      alert('Please upload text-based files only (txt, md, json, etc).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newFile: KnowledgeFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        lastModified: file.lastModified,
        content: content
      };
      onAddFile(newFile);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      if (backupInputRef.current) backupInputRef.current.value = '';
    }
  };

  const providers: {id: AIProvider, label: string, keyUrl: string}[] = [
    { id: 'gemini', label: 'Google Gemini', keyUrl: 'https://aistudio.google.com/app/apikey' },
    { id: 'openai', label: 'OpenAI (GPT-4)', keyUrl: 'https://platform.openai.com/api-keys' },
    { id: 'anthropic', label: 'Anthropic (Claude)', keyUrl: 'https://console.anthropic.com/settings/keys' },
    { id: 'custom', label: 'Custom / Local LLM', keyUrl: '' },
  ];

  const currentProviderInfo = providers.find(p => p.id === localConfig.provider);

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings size={32} className="text-blue-500" />
            Project Settings
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Configure AI assistants, knowledge bases, and third-party integrations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
          <button 
            onClick={() => setActiveTab('connection')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'connection' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Key size={16} /> AI Keys
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'knowledge' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <BrainCircuit size={16} /> Knowledge
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'integrations' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Globe size={16} /> Integrations
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'data' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <HardDrive size={16} /> Data & Backup
          </button>
          <button 
            onClick={() => setActiveTab('context')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'context' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Cpu size={16} /> Debug
          </button>
        </div>

        {/* --- CONNECTION TAB --- */}
        {activeTab === 'connection' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
              <div className="grid gap-6">
                
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">AI Provider</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {providers.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setLocalConfig({...localConfig, provider: p.id})}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          localConfig.provider === p.id 
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                    <span>API Key</span>
                    {currentProviderInfo?.keyUrl && (
                      <a 
                        href={currentProviderInfo.keyUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                      >
                        Get Key <ExternalLink size={10} />
                      </a>
                    )}
                  </label>
                  <div className="relative">
                    <input 
                      type={showKey ? "text" : "password"}
                      value={localConfig.apiKey}
                      onChange={(e) => setLocalConfig({...localConfig, apiKey: e.target.value})}
                      placeholder={`Enter your ${localConfig.provider} API key...`}
                      className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-200 placeholder-slate-600"
                    />
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    >
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Your key is stored locally in your browser. All billing is handled directly between you and {currentProviderInfo?.label}.
                  </p>
                </div>

                {/* Model & Base URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Model Name</label>
                    <input 
                      type="text"
                      value={localConfig.model}
                      onChange={(e) => setLocalConfig({...localConfig, model: e.target.value})}
                      placeholder="e.g., gemini-1.5-flash"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Temperature (0.0 - 1.0)</label>
                    <input 
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={localConfig.temperature}
                      onChange={(e) => setLocalConfig({...localConfig, temperature: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
                    />
                  </div>
                </div>

                {localConfig.provider === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Base URL</label>
                    <input 
                      type="text"
                      value={localConfig.baseUrl || ''}
                      onChange={(e) => setLocalConfig({...localConfig, baseUrl: e.target.value})}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 font-mono text-sm"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                   <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
                   >
                     {isSaved ? <Check size={18} /> : <Save size={18} />}
                     {isSaved ? 'Saved!' : 'Save Configuration'}
                   </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- INTEGRATIONS TAB --- */}
        {activeTab === 'integrations' && (
           <div className="space-y-6">
              {/* Google Analytics */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                       <Globe size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white">Google Analytics (GA4)</h3>
                       <p className="text-slate-400 text-sm mt-1">Automatically track page views and user events across your site.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-300 mb-2">Measurement ID</label>
                       <input 
                         type="text" 
                         placeholder="G-XXXXXXXXXX"
                         value={localIntegrations.googleAnalyticsId}
                         onChange={(e) => setLocalIntegrations({...localIntegrations, googleAnalyticsId: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-200"
                       />
                       <p className="text-xs text-slate-500 mt-2">Find this in your Google Analytics Admin &gt; Data Streams.</p>
                    </div>
                 </div>
              </div>

              {/* Google AdSense */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                       <Megaphone size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white">Google AdSense</h3>
                       <p className="text-slate-400 text-sm mt-1">Monetize your site by displaying automatic ads or custom ad units.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-300 mb-2">Publisher ID</label>
                       <input 
                         type="text" 
                         placeholder="pub-xxxxxxxxxxxxxxxx"
                         value={localIntegrations.googleAdSenseId}
                         onChange={(e) => setLocalIntegrations({...localIntegrations, googleAdSenseId: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-200"
                       />
                       <p className="text-xs text-slate-500 mt-2">Found in AdSense Account &gt; Settings &gt; Account Information.</p>
                    </div>
                 </div>
                 
                 <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">How to use Ad Units?</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                       Once you save your Publisher ID, use the <strong>Google Ad Unit</strong> component from the builder palette to place specific ad slots on your pages. You will need to create Ad Units in your AdSense dashboard to get the specific <code>Slot ID</code>.
                    </p>
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
                   >
                     {isSaved ? <Check size={18} /> : <Save size={18} />}
                     {isSaved ? 'Settings Saved' : 'Save All Settings'}
                   </button>
              </div>
           </div>
        )}

        {/* --- DATA & BACKUP TAB --- */}
        {activeTab === 'data' && (
           <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                       <HardDrive size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white">Project Data Management</h3>
                       <p className="text-slate-400 text-sm mt-1">Backup your entire project state or move it to another device.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Backup */}
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center text-center">
                       <h4 className="font-bold text-slate-200 mb-2">Create Backup</h4>
                       <p className="text-slate-500 text-sm mb-6">Download a complete .json snapshot of your pages, CMS posts, and settings.</p>
                       <button 
                         onClick={onExportBackup}
                         className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2"
                       >
                         <Download size={18} /> Download Backup
                       </button>
                    </div>

                    {/* Restore */}
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center text-center">
                       <h4 className="font-bold text-slate-200 mb-2">Restore Project</h4>
                       <p className="text-slate-500 text-sm mb-6">Overwrite your current project with a previously saved backup file.</p>
                       <div className="relative w-full">
                         <input 
                           type="file" 
                           ref={backupInputRef}
                           onChange={handleBackupUpload}
                           className="hidden"
                           accept=".json"
                         />
                         <button 
                           onClick={() => backupInputRef.current?.click()}
                           className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                         >
                           <Upload size={18} /> Upload Backup
                         </button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                       <strong>Note:</strong> Nexcore saves your work automatically to your browser's Local Storage every few seconds. 
                       Manual backups are recommended before making major changes or clearing browser data.
                    </p>
                 </div>
              </div>
           </div>
        )}

        {/* --- KNOWLEDGE BASE TAB --- */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-xl font-bold text-white mb-1">Project Knowledge Base</h2>
                   <p className="text-slate-400 text-sm">Upload style guides, brand assets, or documentation for the AI to reference.</p>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.md,.json,.csv"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
                  >
                    <Upload size={16} />
                    Upload File
                  </button>
                </div>
              </div>

              {knowledgeFiles.length === 0 ? (
                <div className="border-2 border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 bg-slate-950/50">
                   <FileText size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="font-medium mb-1">No files uploaded yet</p>
                   <p className="text-sm">Upload text files to give your AI specific context about your project.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {knowledgeFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg group hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-slate-200 font-medium">{file.name}</h4>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB • Uploaded {new Date(file.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onRemoveFile(file.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Remove File"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- LIVE CONTEXT TAB --- */}
        {activeTab === 'context' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-[600px] flex flex-col">
               <div className="flex justify-between items-center mb-4">
                 <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                       <Cpu size={20} className="text-purple-400" />
                       System Context
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">This is the structure the AI sees when generating suggestions.</p>
                 </div>
                 <button 
                  onClick={() => setLiveContext(generateSystemContext(pages, posts))}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                  title="Refresh Context"
                 >
                   <RefreshCw size={18} />
                 </button>
               </div>
               
               <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden relative group">
                 <textarea 
                   readOnly
                   value={liveContext}
                   className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-xs resize-none focus:outline-none custom-scrollbar"
                 />
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 bg-blue-600 text-white text-[10px] rounded uppercase font-bold tracking-wider">
                      Read Only
                    </span>
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
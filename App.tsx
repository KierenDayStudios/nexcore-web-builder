import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Builder/Canvas';
import { PropertiesPanel } from './components/Builder/PropertiesPanel';
import { COMPONENT_PALETTE, INITIAL_PAGES, INITIAL_POSTS, BLANK_PAGE } from './constants';
import { SiteElement, BlogPost, Page, Template, AIConfig, KnowledgeFile, IntegrationsConfig, ProjectBackup } from './types';
import { Eye, Code, Smartphone, Tablet, Monitor, Download, Plus, Layers, ChevronDown, Box, Sparkles, FileText, Trash2, FolderPlus, Save, HelpCircle } from 'lucide-react';
import { CodeView } from './components/CodeView';
import { CmsDashboard } from './components/CMS/Dashboard';
import { DeployView } from './components/DeployView';
import { AISettings } from './components/Settings/AISettings';
import { downloadProjectZip } from './utils/projectGenerator';
import { TemplateModal } from './components/TemplateModal';
import { generateSystemContext } from './utils/contextGenerator';
import { AIPromptModal } from './components/Builder/AIPromptModal';
import { LandingPage } from './components/LandingPage';
import { HelpModal } from './components/HelpModal';
import saveAs from 'file-saver';

// Local Storage Keys
const STORAGE_KEY = 'nexcore_project_data';

export default function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'cms' | 'deploy' | 'settings'>('builder');
  
  // State initialization with localStorage check
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState<string>('home');
  const [posts, setPosts] = useState<readonly BlogPost[]>(INITIAL_POSTS);
  
  // AI Configuration State
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.5-flash',
    temperature: 0.7
  });
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  
  // Integrations State
  const [integrations, setIntegrations] = useState<IntegrationsConfig>({
    googleAnalyticsId: '',
    googleAdSenseId: ''
  });

  // UI State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [builderSidebarTab, setBuilderSidebarTab] = useState<'add' | 'layers'>('add');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  // --- INITIALIZATION LOGIC ---
  useEffect(() => {
    // Normal Load from Storage
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: ProjectBackup = JSON.parse(savedData);
        if (parsed.pages && Array.isArray(parsed.pages)) {
           setPages(parsed.pages);
           if (parsed.pages.length > 0) setActivePageId(parsed.pages[0].id);
        }
        if (parsed.posts) setPosts(parsed.posts);
        if (parsed.integrations) setIntegrations(parsed.integrations);
        if (parsed.aiConfig) setAiConfig(parsed.aiConfig);
        if (parsed.knowledgeFiles) setKnowledgeFiles(parsed.knowledgeFiles);
      } catch (e) {
        console.error("Failed to load saved project:", e);
      }
    }
  }, []);

  // --- AUTO-SAVE LOGIC ---
  useEffect(() => {
    if (!hasEnteredApp) return;

    const timeoutId = setTimeout(() => {
      const backup: ProjectBackup = {
        version: '1.0',
        timestamp: Date.now(),
        pages,
        posts,
        integrations,
        aiConfig,
        knowledgeFiles
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
      setLastSaved(new Date().toLocaleTimeString());
    }, 2000); 

    return () => clearTimeout(timeoutId);
  }, [pages, posts, integrations, aiConfig, knowledgeFiles, hasEnteredApp]);


  // Derived State
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const elements = activePage?.elements || [];

  const systemContext = useMemo(() => {
    const baseContext = generateSystemContext(pages, posts);
    const customKnowledge = knowledgeFiles.map(f => `--- FILE: ${f.name} ---\n${f.content}\n`).join('\n');
    return `${baseContext}\n\n## 4. USER KNOWLEDGE BASE\n${customKnowledge}`;
  }, [pages, posts, knowledgeFiles]);

  const findElement = (els: SiteElement[], id: string): SiteElement | null => {
    for (const el of els) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElement(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedId ? findElement(elements, selectedId) : null;

  const setElements = (newElements: SiteElement[]) => {
    setPages(pages.map(p => 
      p.id === activePageId ? { ...p, elements: newElements } : p
    ));
  };

  const updateElement = (id: string, newProps: Record<string, any>) => {
    const updateRecursive = (els: SiteElement[]): SiteElement[] => {
      return els.map(el => {
        if (el.id === id) {
          return { ...el, props: newProps };
        }
        if (el.children) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    };
    setElements(updateRecursive(elements));
  };

  const addElement = (type: SiteElement['type'], defaultProps: any, parentId?: string) => {
    const newElement: SiteElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: { ...defaultProps },
      children: []
    };

    if (parentId) {
      const addToParent = (els: SiteElement[]): SiteElement[] => {
        return els.map(el => {
           if (el.id === parentId) {
             return { ...el, children: [...(el.children || []), newElement] };
           }
           if (el.children) {
             return { ...el, children: addToParent(el.children) };
           }
           return el;
        });
      };
      setElements(addToParent(elements));
    } else {
       // Append to root if no parent, or to selected container if selected
       if (selectedElement && selectedElement.type === 'container' && !parentId) {
         const addToSelected = (els: SiteElement[]): SiteElement[] => {
           return els.map(el => {
              if (el.id === selectedId) {
                return { ...el, children: [...(el.children || []), newElement] };
              }
              if (el.children) {
                return { ...el, children: addToSelected(el.children) };
              }
              return el;
           });
         };
         setElements(addToSelected(elements));
       } else {
         setElements([...elements, newElement]);
       }
    }
  };

  const handleMoveElement = (dragId: string, targetParentId: string | null) => {
    // 1. Find and remove element from its current position
    let movedElement: SiteElement | null = null;
    
    const removeRecursive = (els: SiteElement[]): SiteElement[] => {
      return els.filter(el => {
        if (el.id === dragId) {
          movedElement = el;
          return false;
        }
        if (el.children) {
          el.children = removeRecursive(el.children);
        }
        return true;
      });
    };

    const newTreeWithoutElement = removeRecursive([...elements]);

    if (!movedElement) return;

    // 2. Add to new position
    if (targetParentId === null) {
       // Add to root
       setElements([...newTreeWithoutElement, movedElement]);
    } else {
       const addRecursive = (els: SiteElement[]): SiteElement[] => {
         return els.map(el => {
           if (el.id === targetParentId) {
             return { ...el, children: [...(el.children || []), movedElement!] };
           }
           if (el.children) {
             return { ...el, children: addRecursive(el.children) };
           }
           return el;
         });
       };
       setElements(addRecursive(newTreeWithoutElement));
    }
  };

  const handleAIGeneration = (generatedElements: SiteElement[]) => {
    const appendRecursive = (els: SiteElement[]): SiteElement[] => {
       // If a container is selected, append there
       if (selectedId) {
         return els.map(el => {
            if (el.id === selectedId && el.type === 'container') {
              return { ...el, children: [...(el.children || []), ...generatedElements] };
            }
            if (el.children) {
              return { ...el, children: appendRecursive(el.children) };
            }
            return el;
         });
       }
       // Else return unchanged (we will append to root)
       return els;
    };

    if (selectedId && selectedElement?.type === 'container') {
       setElements(appendRecursive(elements));
    } else {
       setElements([...elements, ...generatedElements]);
    }
  };

  const deleteElement = (id: string) => {
    const deleteRecursive = (els: SiteElement[]): SiteElement[] => {
      return els.filter(el => el.id !== id).map(el => ({
        ...el,
        children: el.children ? deleteRecursive(el.children) : undefined
      }));
    };
    setElements(deleteRecursive(elements));
    if (selectedId === id) setSelectedId(null);
  };

  const addNewPage = () => {
    const name = prompt("Enter page name (e.g., Services):");
    if (!name) return;
    
    const slug = '/' + name.toLowerCase().replace(/\s+/g, '-');
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      slug,
      elements: [
        INITIAL_PAGES[0].elements[0],
        {
          id: `new-${Math.random()}`,
          type: 'container',
          props: { className: 'py-20 px-8 bg-slate-950 text-center min-h-[500px] flex flex-col justify-center' },
          children: [
            { id: `h-${Math.random()}`, type: 'heading', props: { text: name, className: 'text-4xl font-bold text-white mb-4' }},
            { id: `p-${Math.random()}`, type: 'text', props: { text: 'Start building your new page content.', className: 'text-slate-400' }}
          ]
        }
      ]
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) return alert("Cannot delete the last page.");
    if (confirm("Are you sure you want to delete this page?")) {
       const newPages = pages.filter(p => p.id !== id);
       setPages(newPages);
       setActivePageId(newPages[0].id);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    if (confirm("This will overwrite your current project. Are you sure?")) {
      setPages(template.pages);
      setActivePageId(template.pages[0].id);
      setShowTemplateModal(false);
      setSelectedId(null);
    }
  };

  const handleExportBackup = () => {
    const backup: ProjectBackup = {
      version: '1.0',
      timestamp: Date.now(),
      pages,
      posts,
      integrations,
      aiConfig,
      knowledgeFiles
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    saveAs(blob, `nexcore-backup-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup: ProjectBackup = JSON.parse(content);
        
        if (!backup.pages || !Array.isArray(backup.pages)) throw new Error("Invalid backup file");

        if (confirm(`Restore backup from ${new Date(backup.timestamp).toLocaleDateString()}? Current unsaved work will be lost.`)) {
           setPages(backup.pages);
           setPosts(backup.posts || []);
           setIntegrations(backup.integrations || {});
           setAiConfig(backup.aiConfig || aiConfig);
           setKnowledgeFiles(backup.knowledgeFiles || []);
           setActivePageId(backup.pages[0].id);
           alert("Project restored successfully.");
        }
      } catch (err) {
        alert("Failed to import backup. The file may be corrupted.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };


  const renderLayers = (els: SiteElement[], depth = 0) => {
    return els.map(el => (
      <div key={el.id}>
        <div 
          onClick={() => setSelectedId(el.id)}
          className={`flex items-center gap-2 py-2 px-3 cursor-pointer text-xs font-medium transition-all border-l-2 ${
            selectedId === el.id 
              ? 'bg-blue-500/10 text-blue-400 border-blue-500' 
              : 'text-slate-400 hover:bg-slate-800/50 border-transparent hover:text-slate-200'
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {el.children && el.children.length > 0 ? <ChevronDown size={12} /> : <div className="w-3" />}
          {el.type === 'container' ? <Box size={14} className="text-slate-500" /> : <div className="w-3.5 h-3.5 bg-slate-700 rounded-sm" />}
          <span className="truncate capitalize">{el.type}</span>
        </div>
        {el.children && renderLayers(el.children, depth + 1)}
      </div>
    ));
  };

  const renderTopBar = () => (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shadow-md z-20">
      <div className="flex items-center gap-6">
        
        {/* Project Actions */}
        <button 
          onClick={() => setShowTemplateModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          <FolderPlus size={16} className="text-blue-400" />
          <span>New Project</span>
        </button>

        <div className="h-6 w-px bg-slate-800" />
        
        {/* Page Switcher */}
        {activeTab === 'builder' && (
           <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors">
                 <FileText size={16} className="text-blue-400" />
                 <span>{activePage?.name || 'Loading...'}</span>
                 <span className="text-slate-500 text-xs ml-1">({activePage?.slug})</span>
                 <ChevronDown size={14} className="text-slate-500 ml-2" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left z-50">
                <div className="p-2 space-y-1">
                   {pages.map(page => (
                      <div key={page.id} className="flex items-center justify-between group/item">
                        <button 
                          onClick={() => setActivePageId(page.id)}
                          className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left ${activePageId === page.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                          <FileText size={14} />
                          {page.name}
                        </button>
                        {pages.length > 1 && (
                          <button onClick={() => deletePage(page.id)} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                   ))}
                   <div className="h-px bg-slate-800 my-1" />
                   <button onClick={addNewPage} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-slate-800 rounded-lg transition-colors font-medium">
                     <Plus size={14} /> Add New Page
                   </button>
                </div>
              </div>
           </div>
        )}

        {/* View Toggles */}
        {activeTab === 'builder' && (
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'visual' 
                  ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Eye size={16} /> Visual
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'code' 
                  ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Code size={16} /> Code
            </button>
          </div>
        )}
        
        {/* Device Toggles */}
        {activeTab === 'builder' && viewMode === 'visual' && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-md transition-colors ${deviceMode === 'desktop' ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
              title="Desktop"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-2 rounded-md transition-colors ${deviceMode === 'tablet' ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
              title="Tablet"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-md transition-colors ${deviceMode === 'mobile' ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
              title="Mobile"
            >
              <Smartphone size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
        >
          <HelpCircle size={18} />
          <span className="text-sm font-medium">Help Center</span>
        </button>
        {lastSaved && (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Save size={12} /> Saved {lastSaved}
          </span>
        )}
        <button 
          onClick={() => downloadProjectZip(pages, posts, integrations)}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-medium px-4 py-2 text-sm transition-colors"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export Source</span>
        </button>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 text-sm border border-blue-500">
          <Sparkles size={16} />
          Publish
        </button>
      </div>
    </div>
  );

  if (!hasEnteredApp) {
    return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Context Sensitive) */}
        {renderTopBar()}

        <div className="flex-1 flex overflow-hidden relative">
          
          {/* BUILDER MODE */}
          {activeTab === 'builder' && (
            <>
              {/* Builder Sidebar (Left) */}
              <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-10 shrink-0">
                <div className="flex border-b border-slate-800">
                  <button 
                    onClick={() => setBuilderSidebarTab('add')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${builderSidebarTab === 'add' ? 'border-blue-500 text-blue-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    Components
                  </button>
                  <button 
                    onClick={() => setBuilderSidebarTab('layers')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${builderSidebarTab === 'layers' ? 'border-blue-500 text-blue-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    Structure
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {builderSidebarTab === 'add' ? (
                    <div className="space-y-6">
                       {/* AI Prompt Button */}
                       <button 
                         onClick={() => setShowAIModal(true)}
                         className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20"
                       >
                         <Sparkles size={16} /> Generate Section
                       </button>

                       <div className="space-y-3">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Elements</h3>
                         <div className="grid grid-cols-2 gap-2">
                           {COMPONENT_PALETTE.map((comp) => (
                             <div 
                               key={comp.type}
                               draggable
                               onDragStart={(e) => {
                                 e.dataTransfer.setData('application/json', JSON.stringify({ type: 'add', componentType: comp.type, defaultProps: comp.defaultProps }));
                               }}
                               className="flex flex-col items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500/50 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors group"
                             >
                               <comp.icon size={20} className="text-slate-400 group-hover:text-blue-400 mb-2" />
                               <span className="text-xs text-slate-300">{comp.label}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {renderLayers(elements)}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Workspace */}
              {viewMode === 'visual' ? (
                <div className="flex-1 flex overflow-hidden">
                  <Canvas 
                    elements={elements} 
                    selectedId={selectedId} 
                    onSelect={setSelectedId}
                    onDelete={deleteElement}
                    onAddElement={addElement}
                    onMoveElement={handleMoveElement}
                    onUpdateElement={updateElement}
                    deviceMode={deviceMode}
                    posts={posts}
                  />
                  
                  {/* Properties Panel (Right) */}
                  {selectedId && (
                    <PropertiesPanel 
                      element={selectedElement} 
                      onUpdate={updateElement} 
                      onClose={() => setSelectedId(null)}
                      aiConfig={aiConfig}
                      systemContext={systemContext}
                    />
                  )}
                </div>
              ) : (
                <CodeView pages={pages} posts={posts} />
              )}
            </>
          )}

          {/* CMS MODE */}
          {activeTab === 'cms' && <CmsDashboard posts={posts} setPosts={setPosts} />}

          {/* DEPLOY MODE */}
          {activeTab === 'deploy' && <DeployView elements={elements} posts={posts} />}

          {/* SETTINGS MODE */}
          {activeTab === 'settings' && (
            <AISettings 
              config={aiConfig} 
              onSaveConfig={setAiConfig}
              knowledgeFiles={knowledgeFiles}
              onAddFile={(f) => setKnowledgeFiles([...knowledgeFiles, f])}
              onRemoveFile={(id) => setKnowledgeFiles(knowledgeFiles.filter(f => f.id !== id))}
              pages={pages}
              posts={posts}
              integrations={integrations}
              onSaveIntegrations={setIntegrations}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
            />
          )}

        </div>
      </div>

      {/* MODALS */}
      <TemplateModal 
        isOpen={showTemplateModal} 
        onClose={() => setShowTemplateModal(false)} 
        onSelect={handleTemplateSelect} 
      />
      
      <AIPromptModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGeneration}
        config={aiConfig}
        systemContext={systemContext}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

    </div>
  );
}

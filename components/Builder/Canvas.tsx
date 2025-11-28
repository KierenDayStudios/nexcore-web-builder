import React, { useState } from 'react';
import { SiteElement, BlogPost } from '../../types';
import { Trash2, Move, Edit, Image as ImageIcon, Megaphone, Type } from 'lucide-react';

interface CanvasProps {
  elements: SiteElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddElement: (type: SiteElement['type'], defaultProps: any, parentId?: string) => void;
  onMoveElement: (dragId: string, targetParentId: string | null) => void;
  onUpdateElement: (id: string, props: any) => void;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  posts?: readonly BlogPost[];
}

// Recursive renderer component
const ElementRenderer: React.FC<{
  element: SiteElement;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddElement: (type: SiteElement['type'], defaultProps: any, parentId?: string) => void;
  onMoveElement: (dragId: string, targetParentId: string | null) => void;
  onUpdateElement: (id: string, props: any) => void;
  posts?: readonly BlogPost[];
}> = ({ element, selectedId, onSelect, onDelete, onAddElement, onMoveElement, onUpdateElement, posts }) => {
  const isSelected = element.id === selectedId;
  const [isDragOver, setIsDragOver] = useState(false);

  // Selection overlay handler
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'move', id: element.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.type === 'container') {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
     e.preventDefault();
     e.stopPropagation();
     setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const payload = JSON.parse(data);
      if (payload.type === 'add') {
         onAddElement(payload.componentType, payload.defaultProps, element.id);
      } else if (payload.type === 'move') {
         if (payload.id !== element.id) {
           onMoveElement(payload.id, element.id);
         }
      }
    } catch (err) {
      console.error("Drop Error", err);
    }
  };

  // Editable Text Handler
  const handleTextBlur = (e: React.FocusEvent<HTMLElement>, propName: string) => {
     const text = e.currentTarget.innerText;
     if (element.props[propName] !== text) {
        onUpdateElement(element.id, { ...element.props, [propName]: text });
     }
  };

  const commonClasses = `relative group transition-all duration-200 cursor-pointer ${
    isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent z-10' : 'hover:ring-1 hover:ring-blue-400/50'
  } ${isDragOver ? 'ring-2 ring-green-500 bg-green-500/10' : ''}`;

  // Safe style extraction
  const styles = element.props.style || {};

  // Render specific content based on type
  const renderContent = () => {
    switch (element.type) {
      case 'hero':
        return (
          <div 
            className={`py-20 px-8 text-center ${element.props.backgroundColor || 'bg-slate-900'}`}
            style={{ ...styles, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <h1 
              className={`text-4xl md:text-6xl font-bold mb-6 outline-none ${element.props.textColor || 'text-white'}`}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextBlur(e, 'title')}
            >
              {element.props.title}
            </h1>
            <p 
              className={`text-xl mb-8 max-w-2xl mx-auto opacity-90 outline-none ${element.props.textColor || 'text-white'}`}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextBlur(e, 'subtitle')}
            >
              {element.props.subtitle}
            </p>
            <button 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextBlur(e, 'buttonText')}
            >
              {element.props.buttonText}
            </button>
          </div>
        );

      case 'container':
        return (
          <div 
            className={element.props.className}
            style={{ ...styles, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            {element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
                onAddElement={onAddElement}
                onMoveElement={onMoveElement}
                onUpdateElement={onUpdateElement}
                posts={posts}
              />
            ))}
            {(!element.children || element.children.length === 0) && (
              <div className="p-4 flex flex-col items-center justify-center text-center text-slate-400/50 border border-dashed border-slate-300/20 rounded min-h-[100px] pointer-events-none">
                <span className="text-xs font-medium">Empty Container</span>
                <span className="text-[10px] mt-1">Drop components here</span>
              </div>
            )}
          </div>
        );

      case 'card':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-full" style={styles}>
            <h3 
              className="text-xl font-bold text-slate-800 mb-2 outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextBlur(e, 'title')}
            >
              {element.props.title}
            </h3>
            <p 
              className="text-slate-600 outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextBlur(e, 'content')}
            >
              {element.props.content}
            </p>
          </div>
        );
      
      case 'blog-grid':
        return (
          <div className={element.props.className} style={styles}>
             {posts?.filter(p => p.status === 'published').map(post => (
               <div key={post.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                 <div 
                   className="h-48 bg-slate-200 w-full bg-cover bg-center relative" 
                   style={{ backgroundImage: post.image ? `url(${post.image})` : undefined }}
                 >
                   {!post.image && <div className="absolute inset-0 flex items-center justify-center text-slate-400"><ImageIcon size={24} /></div>}
                 </div>
                 <div className="p-4 flex-1 flex flex-col">
                    <span className="text-xs font-semibold text-blue-600 mb-2 block">{post.date}</span>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{post.title}</h4>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt || post.content.substring(0, 100)}...</p>
                    <div className="mt-auto pt-2 border-t border-slate-100">
                      <p className="text-slate-500 text-xs font-medium">By {post.author}</p>
                    </div>
                 </div>
               </div>
             ))}
             {(!posts || posts.length === 0) && <p className="text-slate-500">No published posts found.</p>}
          </div>
        );
        
      case 'adsense-unit':
        return (
           <div className={`${element.props.className} overflow-hidden`} style={styles}>
              <div className="w-full h-full min-h-[100px] border-2 border-dashed border-green-500/30 bg-green-500/5 flex flex-col items-center justify-center p-4 text-green-600/70">
                 <Megaphone size={32} className="mb-2 opacity-50" />
                 <span className="font-bold text-sm uppercase tracking-wider">Ad Space</span>
                 <span className="text-xs mt-1">Slot: {element.props.slotId || 'Not Set'}</span>
                 <span className="text-[10px] mt-1 opacity-70">(Visual Placeholder)</span>
              </div>
           </div>
        );

      case 'heading':
        return (
          <h2 
            className={`${element.props.className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded`} 
            style={styles}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleTextBlur(e, 'text')}
          >
            {element.props.text}
          </h2>
        );

      case 'text':
        return (
          <p 
            className={`${element.props.className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded`} 
            style={styles}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleTextBlur(e, 'text')}
          >
            {element.props.text}
          </p>
        );

      case 'button':
        return (
          <button 
            className={`${element.props.className} outline-none`} 
            style={styles}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleTextBlur(e, 'text')}
          >
            {element.props.text}
          </button>
        );

      case 'image':
        return <img src={element.props.src} alt={element.props.alt} className={element.props.className} style={styles} />;
      
      case 'video':
        return <video src={element.props.src} className={element.props.className} style={styles} controls />;
        
      case 'iframe':
        return (
          <div className={`${element.props.className} relative`} style={styles}>
            {/* Overlay to catch clicks in builder mode so you can select the component */}
            <div className="absolute inset-0 z-10 bg-transparent" /> 
            <iframe 
              src={element.props.src} 
              className="w-full h-full border-0" 
              title="embedded-content"
            />
          </div>
        );

      case 'input':
        return <input placeholder={element.props.placeholder} className={element.props.className} style={styles} disabled />;

      default:
        return null;
    }
  };

  return (
    <div 
      draggable={element.type !== 'container'}
      onDragStart={handleDragStart}
      onClick={handleClick} 
      className={element.type === 'container' || element.type === 'hero' ? '' : 'p-0.5'}
    >
      <div className={element.type === 'container' || element.type === 'hero' ? '' : commonClasses}>
        {renderContent()}
        
        {/* Hover/Selection Actions */}
        {isSelected && (
          <div className="absolute -top-7 left-0 flex items-center gap-1 z-50">
             <div className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-t-md shadow-sm flex items-center gap-1">
               <Move size={10} />
               {element.type}
             </div>
             <button 
              onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
              className="p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm mb-1 ml-1"
              title="Delete Element"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  selectedId, 
  onSelect, 
  onDelete, 
  onAddElement, 
  onMoveElement,
  onUpdateElement,
  deviceMode, 
  posts 
}) => {
  const getWidth = () => {
    switch (deviceMode) {
      case 'mobile': return 'w-[375px]';
      case 'tablet': return 'w-[768px]';
      default: return 'w-full';
    }
  };

  // Root drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    try {
      const payload = JSON.parse(data);
      if (payload.type === 'add') {
         onAddElement(payload.componentType, payload.defaultProps);
      } else if (payload.type === 'move') {
         onMoveElement(payload.id, null); // Move to root
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="flex-1 bg-slate-950 overflow-y-auto p-8 flex justify-center cursor-default relative" 
      onClick={() => onSelect('')}
    >
       {/* Dot Pattern Background for Workspace */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div 
        className={`${getWidth()} min-h-[800px] bg-white shadow-2xl transition-all duration-300 origin-top z-10`}
        style={{ transform: deviceMode === 'desktop' ? 'none' : 'scale(0.95)' }}
        onClick={(e) => e.stopPropagation()} 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {elements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Type size={32} className="opacity-30" />
            </div>
            <p className="font-medium">Canvas is empty</p>
            <p className="text-sm mt-2">Drag components from the left sidebar to start building</p>
          </div>
        ) : (
          elements.map(el => (
            <ElementRenderer
              key={el.id}
              element={el}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onAddElement={onAddElement}
              onMoveElement={onMoveElement}
              onUpdateElement={onUpdateElement}
              posts={posts}
            />
          ))
        )}
      </div>
    </div>
  );
};
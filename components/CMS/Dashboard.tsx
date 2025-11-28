import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { Plus, Search, MoreVertical, FileText, Globe, ArrowLeft, Image as ImageIcon, Calendar, User, Save, Trash2 } from 'lucide-react';

interface CmsDashboardProps {
  posts: readonly BlogPost[];
  setPosts: (posts: readonly BlogPost[]) => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ posts, setPosts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddPost = () => {
    const newPost: BlogPost = {
       id: Math.random().toString(36).substr(2, 9),
       title: 'Untitled Post',
       slug: 'untitled-post',
       content: 'Start writing your amazing story here...',
       excerpt: '',
       status: 'draft',
       date: new Date().toISOString().split('T')[0],
       author: 'Admin'
    };
    setPosts([newPost, ...posts]);
    setEditingId(newPost.id);
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const newPosts = posts.map(p => {
        if (p.id === id) return { ...p, ...updates };
        return p;
    });
    setPosts(newPosts);
  };

  const deletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(p => p.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const activePost = posts.find(p => p.id === editingId);

  // --- EDITOR VIEW ---
  if (editingId && activePost) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setEditingId(null)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-800" />
            <span className="text-sm font-medium text-slate-500">
               {activePost.status === 'draft' ? 'Unpublished Draft' : 'Published Live'}
            </span>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => deletePost(activePost.id)}
               className="p-2 text-slate-500 hover:text-red-400 transition-colors"
               title="Delete Post"
             >
               <Trash2 size={18} />
             </button>
             <button 
               onClick={() => setEditingId(null)}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium text-sm"
             >
               <Save size={16} />
               Done Editing
             </button>
          </div>
        </div>

        {/* Editor Workspace */}
        <div className="flex-1 flex overflow-hidden">
           
           {/* Main Content Area */}
           <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
             <div className="max-w-3xl mx-auto space-y-6">
               <input
                 type="text"
                 value={activePost.title}
                 onChange={(e) => updatePost(activePost.id, { title: e.target.value })}
                 placeholder="Post Title"
                 className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder-slate-700 outline-none border-none"
               />
               <textarea
                 value={activePost.content}
                 onChange={(e) => updatePost(activePost.id, { content: e.target.value })}
                 placeholder="Tell your story..."
                 className="w-full min-h-[500px] bg-transparent text-lg text-slate-300 placeholder-slate-700 outline-none border-none resize-none leading-relaxed"
               />
             </div>
           </div>

           {/* Sidebar Properties */}
           <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Post Settings</h3>
              
              <div className="space-y-6">
                
                {/* Status */}
                <div>
                   <label className="text-xs text-slate-400 mb-2 block">Status</label>
                   <select 
                     value={activePost.status}
                     onChange={(e) => updatePost(activePost.id, { status: e.target.value as any })}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"
                   >
                     <option value="draft">Draft</option>
                     <option value="published">Published</option>
                   </select>
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">URL Slug</label>
                  <input 
                    type="text" 
                    value={activePost.slug}
                    onChange={(e) => updatePost(activePost.id, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                    <Calendar size={12} /> Publish Date
                  </label>
                  <input 
                    type="date" 
                    value={activePost.date}
                    onChange={(e) => updatePost(activePost.id, { date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                    <User size={12} /> Author
                  </label>
                  <input 
                    type="text" 
                    value={activePost.author}
                    onChange={(e) => updatePost(activePost.id, { author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                    <ImageIcon size={12} /> Cover Image URL
                  </label>
                  <input 
                    type="text" 
                    value={activePost.image || ''}
                    onChange={(e) => updatePost(activePost.id, { image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"
                  />
                  {activePost.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-800 h-32">
                      <img src={activePost.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                   <label className="text-xs text-slate-400 mb-2 block">Excerpt / Summary</label>
                   <textarea
                     value={activePost.excerpt || ''}
                     onChange={(e) => updatePost(activePost.id, { excerpt: e.target.value })}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 h-24 resize-none"
                     placeholder="A short summary for the card view..."
                   />
                </div>

              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Content Manager</h1>
            <p className="text-slate-400 mt-2">Manage your blog posts, case studies, and dynamic content.</p>
          </div>
          <button 
            onClick={handleAddPost}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 font-medium"
          >
            <Plus size={18} />
            <span>New Post</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">Total Posts</h3>
              <FileText className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{posts.length}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">Published</h3>
              <Globe className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{posts.filter(p => p.status === 'published').length}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">Drafts</h3>
              <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
            </div>
            <p className="text-3xl font-bold text-white">{posts.filter(p => p.status === 'draft').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search posts..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-200 placeholder-slate-600"
              />
            </div>
            <select className="px-4 py-2 border border-slate-700 rounded-lg text-sm text-slate-300 bg-slate-950 outline-none focus:border-blue-500">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
          
          <table className="w-full">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {posts.map((post) => (
                <tr 
                  key={post.id} 
                  onClick={() => setEditingId(post.id)}
                  className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{post.title}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      post.status === 'published' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-400">{post.author}</td>
                  <td className="py-4 px-6 text-sm text-slate-500">{post.date}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
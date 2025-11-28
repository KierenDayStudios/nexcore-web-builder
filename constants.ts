import { SiteElement, Page, Template, BlogPost } from './types';
import { Type, Image, MousePointer2, Box, Heading1, FormInput, Newspaper, Video, Menu, DollarSign, Globe, Megaphone } from 'lucide-react';
import { ComponentConfig } from './types';

// Shared Navbar Element to reuse across pages
const SHARED_NAVBAR: SiteElement = {
  id: 'nav-1',
  type: 'container',
  props: {
    className: 'flex justify-between items-center p-6 bg-slate-950 border-b border-slate-900 sticky top-0 z-50 backdrop-blur-md bg-opacity-80'
  },
  children: [
    {
      id: 'nav-logo',
      type: 'heading',
      props: {
        text: 'NEXCORE',
        className: 'text-2xl font-black text-white tracking-tighter'
      }
    },
    {
      id: 'nav-links',
      type: 'container',
      props: {
        className: 'flex gap-8 hidden md:flex items-center'
      },
      children: [
        { id: 'l1', type: 'text', props: { text: 'Features', className: 'text-slate-400 font-medium hover:text-white cursor-pointer transition-colors text-sm' }},
        { id: 'l2', type: 'text', props: { text: 'Showcase', className: 'text-slate-400 font-medium hover:text-white cursor-pointer transition-colors text-sm' }},
        { id: 'l3', type: 'text', props: { text: 'Pricing', className: 'text-slate-400 font-medium hover:text-white cursor-pointer transition-colors text-sm' }},
      ]
    },
    {
      id: 'nav-cta',
      type: 'button',
      props: {
        text: 'Early Access',
        className: 'px-5 py-2 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors text-sm'
      }
    }
  ]
};

// --- NEXCORE LANDING PAGE TEMPLATE ---

const NEXCORE_LANDING_PAGE: Page[] = [
  {
    id: 'home',
    name: 'Home',
    slug: '/',
    elements: [
      SHARED_NAVBAR,
      // HERO SECTION
      {
        id: 'nexus-hero',
        type: 'container',
        props: { className: 'relative pt-32 pb-20 px-6 overflow-hidden bg-slate-950 flex flex-col items-center text-center' },
        children: [
          // Background Glow
          {
             id: 'glow-1',
             type: 'container',
             props: { className: 'absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none' }
          },
          // Badge
          {
            id: 'hero-badge',
            type: 'container',
            props: { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8' },
            children: [
               { id: 'badge-txt', type: 'text', props: { text: 'Nexcore Web Builder v1.0', className: '' }}
            ]
          },
          // Headline
          {
            id: 'hero-h1',
            type: 'heading',
            props: { 
              text: 'Build the Web of Tomorrow.', 
              className: 'relative z-10 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tight max-w-4xl' 
            }
          },
          // Subhead
          {
            id: 'hero-sub',
            type: 'text',
            props: { 
              text: 'The first hybrid website architect. Drag and drop visually, export clean React code, and manage content with an integrated CMS.', 
              className: 'relative z-10 text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed' 
            }
          },
          // Buttons
          {
            id: 'hero-btns',
            type: 'container',
            props: { className: 'relative z-10 flex flex-col md:flex-row gap-4' },
            children: [
              { id: 'btn-p', type: 'button', props: { text: 'Start Building Free', className: 'px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]' }},
              { id: 'btn-s', type: 'button', props: { text: 'View Documentation', className: 'px-8 py-4 bg-slate-900 text-white border border-slate-800 rounded-xl font-bold hover:bg-slate-800 transition-colors' }}
            ]
          },
          // Dashboard Preview
          {
            id: 'hero-img-con',
            type: 'container',
            props: { className: 'mt-20 relative z-10 w-full max-w-5xl p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm' },
            children: [
               { id: 'hero-img', type: 'image', props: { src: 'https://picsum.photos/seed/interface/1200/800', alt: 'Interface', className: 'w-full rounded-lg shadow-2xl opacity-80' }}
            ]
          }
        ]
      },
      // BENTO GRID FEATURES
      {
        id: 'features',
        type: 'container',
        props: { className: 'py-32 px-6 bg-slate-950' },
        children: [
          {
             id: 'feat-header',
             type: 'container',
             props: { className: 'max-w-3xl mx-auto text-center mb-20' },
             children: [
                { id: 'fh-1', type: 'heading', props: { text: 'Everything you need to ship.', className: 'text-3xl md:text-5xl font-bold text-white mb-6' }},
                { id: 'fp-1', type: 'text', props: { text: 'Nexcore bridges the gap between design tools and code editors. It is not just a builder; it is a development environment.', className: 'text-slate-400 text-lg' }}
             ]
          },
          {
            id: 'bento-grid',
            type: 'container',
            props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto' },
            children: [
              // Large Card
              {
                id: 'card-large',
                type: 'container',
                props: { className: 'md:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-colors' },
                children: [
                   { id: 'cl-bg', type: 'container', props: { className: 'absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl' }},
                   { id: 'cl-h', type: 'heading', props: { text: 'Visual to Code', className: 'text-2xl font-bold text-white mb-2 relative z-10' }},
                   { id: 'cl-p', type: 'text', props: { text: 'Design visually on the canvas, then export production-ready React + Tailwind code instantly.', className: 'text-slate-400 mb-8 max-w-sm relative z-10' }},
                   { id: 'cl-img', type: 'image', props: { src: 'https://picsum.photos/seed/code/800/400', className: 'w-full h-48 object-cover rounded-xl border border-slate-700 opacity-80 group-hover:opacity-100 transition-opacity' }}
                ]
              },
              // Tall Card
              {
                id: 'card-tall',
                type: 'container',
                props: { className: 'md:row-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col hover:border-purple-500/50 transition-colors' },
                children: [
                   { id: 'ct-icon', type: 'container', props: { className: 'w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400' }, children: [{ id: 'icon-ai', type: 'heading', props: { text: 'AI', className: 'font-bold' }}]},
                   { id: 'ct-h', type: 'heading', props: { text: 'AI Co-pilot', className: 'text-2xl font-bold text-white mb-2' }},
                   { id: 'ct-p', type: 'text', props: { text: 'Stuck on copy? Need a layout idea? The built-in AI assistant understands your project context and helps you build faster.', className: 'text-slate-400 mb-8 flex-1' }},
                   { id: 'ct-viz', type: 'container', props: { className: 'w-full h-32 bg-slate-800 rounded-xl border border-slate-700/50 p-4' }, children: [
                      { id: 'msg-1', type: 'text', props: { text: 'AI: "I suggest a hero section here."', className: 'text-xs text-purple-300 mb-2' }},
                      { id: 'msg-2', type: 'text', props: { text: 'User: "Add it."', className: 'text-xs text-slate-500 text-right' }}
                   ]}
                ]
              },
              // Small Card 1
              {
                id: 'card-sm-1',
                type: 'container',
                props: { className: 'bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-green-500/50 transition-colors' },
                children: [
                   { id: 'cs1-h', type: 'heading', props: { text: 'Headless CMS', className: 'text-xl font-bold text-white mb-2' }},
                   { id: 'cs1-p', type: 'text', props: { text: 'Manage blogs, authors, and dynamic content without a separate dashboard.', className: 'text-slate-400 text-sm' }}
                ]
              },
              // Small Card 2
              {
                id: 'card-sm-2',
                type: 'container',
                props: { className: 'bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-pink-500/50 transition-colors' },
                children: [
                   { id: 'cs2-h', type: 'heading', props: { text: 'Git Sync', className: 'text-xl font-bold text-white mb-2' }},
                   { id: 'cs2-p', type: 'text', props: { text: 'Push directly to GitHub. We handle the commit history and branch management.', className: 'text-slate-400 text-sm' }}
                ]
              }
            ]
          }
        ]
      },
      // TECH STACK
      {
        id: 'tech-stack',
        type: 'container',
        props: { className: 'py-20 border-t border-slate-900 bg-slate-950 flex flex-col items-center' },
        children: [
           { id: 'ts-head', type: 'heading', props: { text: 'BUILT ON MODERN STANDARDS', className: 'text-sm font-bold text-blue-500 tracking-widest mb-10' }},
           {
             id: 'ts-row',
             type: 'container',
             props: { className: 'flex flex-wrap justify-center gap-4 md:gap-8' },
             children: [
               { id: 'b-1', type: 'button', props: { text: 'React 19', className: 'px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm' }},
               { id: 'b-2', type: 'button', props: { text: 'Tailwind CSS', className: 'px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm' }},
               { id: 'b-3', type: 'button', props: { text: 'TypeScript', className: 'px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm' }},
               { id: 'b-4', type: 'button', props: { text: 'Vite', className: 'px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm' }},
               { id: 'b-5', type: 'button', props: { text: 'ES Modules', className: 'px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm' }},
             ]
           }
        ]
      },
      // CTA
      {
        id: 'cta-sec',
        type: 'container',
        props: { className: 'py-32 px-6 bg-gradient-to-b from-slate-950 to-blue-950/20 text-center' },
        children: [
          { id: 'cta-h', type: 'heading', props: { text: 'Ready to build faster?', className: 'text-4xl md:text-6xl font-bold text-white mb-8' }},
          { id: 'cta-btn', type: 'button', props: { text: 'Launch Builder Now', className: 'px-10 py-5 bg-white text-blue-900 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl' }}
        ]
      },
      // FOOTER
      {
        id: 'footer',
        type: 'container',
        props: { className: 'py-12 px-8 bg-black border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm' },
        children: [
           { id: 'copy', type: 'text', props: { text: '© 2024 Nexcore. All rights reserved.' }},
           { 
             id: 'links', 
             type: 'container', 
             props: { className: 'flex gap-6 mt-4 md:mt-0' },
             children: [
                { id: 'fl-1', type: 'text', props: { text: 'Privacy', className: 'hover:text-white cursor-pointer' }},
                { id: 'fl-2', type: 'text', props: { text: 'Terms', className: 'hover:text-white cursor-pointer' }},
                { id: 'fl-3', type: 'text', props: { text: 'GitHub', className: 'hover:text-white cursor-pointer' }},
             ]
           }
        ]
      }
    ]
  }
];


// --- EXISTING TEMPLATES ---

const SAAS_PAGES: Page[] = [
  {
    id: 'home',
    name: 'Home',
    slug: '/',
    elements: [
      SHARED_NAVBAR,
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          title: 'Design Without Limits.',
          subtitle: 'Create stunning, production-ready websites visually. Export clean React code in one click.',
          buttonText: 'Start Building',
          backgroundColor: 'bg-slate-950',
          textColor: 'text-white'
        }
      },
      {
        id: 'feat-section',
        type: 'container',
        props: {
          className: 'py-20 px-8 bg-slate-900',
        },
        children: [
           {
            id: 'feat-head',
            type: 'heading',
            props: { text: 'Why Nexcore?', className: 'text-3xl font-bold text-center mb-12 text-white' }
           },
           {
             id: 'grid-1',
             type: 'container',
             props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto' },
             children: [
                {
                  id: 'card-1',
                  type: 'card',
                  props: {
                    title: 'Visual Logic',
                    content: 'Control Flexbox, Grid, and Spacing visually. No CSS knowledge required.'
                  }
                },
                {
                  id: 'card-2',
                  type: 'card',
                  props: {
                    title: 'Instant Export',
                    content: 'Get a full Vite project zip file ready to deploy to Netlify or Vercel.'
                  }
                },
                {
                  id: 'card-3',
                  type: 'card',
                  props: {
                    title: 'CMS Integrated',
                    content: 'Manage blog posts and dynamic content directly within the builder.'
                  }
                }
             ]
           }
        ]
      }
    ]
  },
  {
    id: 'about',
    name: 'About',
    slug: '/about',
    elements: [
      SHARED_NAVBAR,
      {
        id: 'about-hero',
        type: 'container',
        props: { className: 'py-24 px-8 bg-slate-950 text-center' },
        children: [
          { id: 'ab-h1', type: 'heading', props: { text: 'About Our Mission', className: 'text-5xl font-bold text-white mb-6' }},
          { id: 'ab-p1', type: 'text', props: { text: 'We are dedicated to making web development accessible to everyone, everywhere.', className: 'text-xl text-slate-400 max-w-2xl mx-auto' }}
        ]
      },
      {
        id: 'about-img',
        type: 'image',
        props: { src: 'https://picsum.photos/1200/600', alt: 'Team', className: 'w-full max-w-5xl mx-auto rounded-2xl shadow-2xl mb-20' }
      }
    ]
  },
  {
    id: 'contact',
    name: 'Contact',
    slug: '/contact',
    elements: [
      SHARED_NAVBAR,
      {
        id: 'contact-wrap',
        type: 'container',
        props: { className: 'min-h-screen bg-slate-950 py-20 px-4 flex items-center justify-center' },
        children: [
          {
            id: 'contact-card',
            type: 'container',
            props: { className: 'bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-md w-full' },
            children: [
               { id: 'ct-h1', type: 'heading', props: { text: 'Get in Touch', className: 'text-2xl font-bold text-white mb-6' }},
               { id: 'ct-in1', type: 'input', props: { placeholder: 'Your Name', className: 'w-full p-3 bg-slate-950 border border-slate-800 rounded-lg mb-4 text-white focus:border-blue-500 outline-none' }},
               { id: 'ct-in2', type: 'input', props: { placeholder: 'Email Address', className: 'w-full p-3 bg-slate-950 border border-slate-800 rounded-lg mb-4 text-white focus:border-blue-500 outline-none' }},
               { id: 'ct-btn', type: 'button', props: { text: 'Send Message', className: 'w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500' }}
            ]
          }
        ]
      }
    ]
  }
];

const PORTFOLIO_PAGES: Page[] = [
  {
    id: 'home',
    name: 'Home',
    slug: '/',
    elements: [
      {
        id: 'p-nav',
        type: 'container',
        props: { className: 'p-8 flex justify-between items-center bg-transparent absolute top-0 w-full z-10' },
        children: [
          { id: 'p-logo', type: 'heading', props: { text: 'ALEX.DEV', className: 'text-xl font-bold text-white' }},
          { id: 'p-contact-btn', type: 'button', props: { text: 'Hire Me', className: 'px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors' }}
        ]
      },
      {
        id: 'p-hero',
        type: 'container',
        props: { className: 'min-h-screen flex items-center bg-slate-950 px-8 relative overflow-hidden' },
        children: [
          {
            id: 'p-content',
            type: 'container',
            props: { className: 'max-w-4xl relative z-10' },
            children: [
              { id: 'p-h1', type: 'heading', props: { text: 'I Build Digital Products.', className: 'text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter' }},
              { id: 'p-sub', type: 'text', props: { text: 'Senior Frontend Engineer based in San Francisco. Specializing in React, Node.js, and UI Design.', className: 'text-xl text-slate-400 max-w-2xl' }}
            ]
          }
        ]
      },
      {
        id: 'p-work',
        type: 'container',
        props: { className: 'py-20 px-8 bg-black' },
        children: [
           { id: 'p-work-h', type: 'heading', props: { text: 'Selected Work', className: 'text-3xl font-bold text-white mb-12' }},
           {
             id: 'p-grid',
             type: 'container',
             props: { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
             children: [
               { id: 'w-1', type: 'image', props: { src: 'https://picsum.photos/800/600?1', className: 'w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500' }},
               { id: 'w-2', type: 'image', props: { src: 'https://picsum.photos/800/600?2', className: 'w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500' }}
             ]
           }
        ]
      }
    ]
  }
];

export const BLANK_PAGE: Page[] = [
  {
    id: 'home',
    name: 'Home',
    slug: '/',
    elements: [
       {
         id: 'blank-1',
         type: 'container',
         props: { className: 'min-h-screen bg-white p-8' },
         children: []
       }
    ]
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'nexus-landing',
    name: 'Nexcore Product Landing',
    description: 'A modern, high-converting landing page for the Nexcore builder itself. Features bento grids, glassmorphism, and gradients.',
    pages: NEXCORE_LANDING_PAGE
  },
  {
    id: 'saas',
    name: 'SaaS Startup',
    description: 'A complete multi-page site with Hero, Features, Pricing, and a Blog. Perfect for software companies.',
    pages: SAAS_PAGES
  },
  {
    id: 'portfolio',
    name: 'Developer Portfolio',
    description: 'Dark mode, high-contrast typography, and image grids to showcase your work.',
    pages: PORTFOLIO_PAGES
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'An empty white page. No styles, no components. Total freedom.',
    pages: BLANK_PAGE
  }
];

export const INITIAL_PAGES = SAAS_PAGES;

export const INITIAL_POSTS: BlogPost[] = [
  { 
    id: '1', 
    title: 'The Art of Visual Design', 
    slug: 'art-of-visual-design',
    content: 'Design is not just about making things look good. It is about how things work. In this article, we explore the fundamental principles of visual hierarchy and how they affect user conversion rates...',
    excerpt: 'Design is not just about making things look good. It is about how things work.',
    image: 'https://picsum.photos/seed/post1/800/600',
    status: 'published', 
    date: '2023-10-15', 
    author: 'Nexcore Team' 
  },
  { 
    id: '2', 
    title: 'How to ship faster', 
    slug: 'how-to-ship-faster',
    content: 'Speed is currency in the modern web development landscape. We break down the CI/CD pipelines that power the biggest tech companies in the world.',
    excerpt: 'Speed is currency. We break down the CI/CD pipelines that power the biggest tech companies.',
    image: 'https://picsum.photos/seed/post2/800/600',
    status: 'published', 
    date: '2023-10-20', 
    author: 'Engineering' 
  },
  { 
    id: '3', 
    title: 'Q4 Product Roadmap', 
    slug: 'q4-product-roadmap',
    content: 'Coming soon: A deeper look into what we are building for the next quarter. Spoiler alert: AI integration is huge.',
    excerpt: 'A deeper look into what we are building for the next quarter.',
    image: 'https://picsum.photos/seed/post3/800/600',
    status: 'draft', 
    date: '2023-11-01', 
    author: 'Product' 
  },
];


export const COMPONENT_PALETTE: ComponentConfig[] = [
  {
    type: 'container',
    label: 'Container / Box',
    icon: Box,
    defaultProps: { className: 'p-8 min-h-[100px] bg-slate-900 border border-dashed border-slate-700' }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading1,
    defaultProps: { text: 'Big Idea', className: 'text-4xl font-extrabold text-white leading-tight' }
  },
  {
    type: 'text',
    label: 'Paragraph',
    icon: Type,
    defaultProps: { text: 'Write something amazing here. Typography is the voice of your design.', className: 'text-slate-400 leading-relaxed max-w-2xl' }
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer2,
    defaultProps: { text: 'Click Me', className: 'px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg' }
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    defaultProps: { src: 'https://picsum.photos/800/500', alt: 'Demo', className: 'w-full h-64 object-cover rounded-xl shadow-md' }
  },
  {
    type: 'video',
    label: 'Video Embed',
    icon: Video,
    defaultProps: { src: 'https://www.w3schools.com/html/mov_bbb.mp4', className: 'w-full rounded-xl shadow-lg' }
  },
  {
    type: 'iframe',
    label: 'Embed / Iframe',
    icon: Globe,
    defaultProps: { src: 'https://www.wikipedia.org', className: 'w-full h-[500px] border-0 rounded-xl bg-white' }
  },
  {
    type: 'container', // Pre-configured Navbar
    label: 'Navbar',
    icon: Menu,
    defaultProps: { className: 'flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800 w-full' },
    defaultChildren: [
      { id: 'temp-logo', type: 'heading', props: { text: 'Brand', className: 'text-xl font-bold text-white' }},
      { id: 'temp-menu', type: 'container', props: { className: 'flex gap-4' }, children: [
        { id: 'l1', type: 'text', props: { text: 'Link 1', className: 'text-slate-400' }},
        { id: 'l2', type: 'text', props: { text: 'Link 2', className: 'text-slate-400' }}
      ]}
    ]
  },
  {
    type: 'container', // Pre-configured Pricing
    label: 'Pricing Card',
    icon: DollarSign,
    defaultProps: { className: 'p-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col items-center text-center' },
    defaultChildren: [
      { id: 'p-head', type: 'heading', props: { text: 'Pro Plan', className: 'text-xl font-medium text-slate-500 mb-2' }},
      { id: 'p-price', type: 'heading', props: { text: '$29', className: 'text-5xl font-bold text-white mb-6' }},
      { id: 'p-btn', type: 'button', props: { text: 'Choose Plan', className: 'w-full py-3 bg-white text-slate-900 font-bold rounded-lg' }}
    ]
  },
  {
    type: 'blog-grid',
    label: 'Blog Grid',
    icon: Newspaper,
    defaultProps: { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' }
  },
  {
    type: 'input',
    label: 'Form Input',
    icon: FormInput,
    defaultProps: { placeholder: 'email@example.com', className: 'w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-white' }
  },
  {
    type: 'adsense-unit',
    label: 'Google Ad Unit',
    icon: Megaphone,
    defaultProps: { 
      slotId: '1234567890', 
      format: 'auto',
      layoutKey: '',
      className: 'w-full min-h-[100px] bg-slate-100 flex items-center justify-center'
    }
  },
];
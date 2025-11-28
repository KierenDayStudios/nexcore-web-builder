import JSZip from 'jszip';
import saveAs from 'file-saver';
import { SiteElement, BlogPost, Page, IntegrationsConfig } from '../types';

// Helper to generate React JSX string recursively
const generateComponentJSX = (elements: SiteElement[], depth = 4, integrations?: IntegrationsConfig): string => {
  return elements.map(el => {
    const indent = ' '.repeat(depth);
    
    // Filter props to valid JSX attributes
    const propsStr = Object.entries(el.props)
      .filter(([key]) => key !== 'text' && key !== 'content' && key !== 'title' && key !== 'subtitle' && key !== 'buttonText' && key !== 'slotId' && key !== 'format' && key !== 'layoutKey')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    const safeProps = propsStr ? ` ${propsStr}` : '';

    switch (el.type) {
      case 'hero':
        return `${indent}<section className="${el.props.backgroundColor} py-20 px-8 text-center">\n` +
               `${indent}  <h1 className="text-4xl md:text-6xl font-bold mb-6 ${el.props.textColor}">${el.props.title}</h1>\n` +
               `${indent}  <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 ${el.props.textColor}">${el.props.subtitle}</p>\n` +
               `${indent}  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">${el.props.buttonText}</button>\n` +
               `${indent}</section>`;
      
      case 'container':
        const childrenCode = el.children ? generateComponentJSX(el.children, depth + 2, integrations) : '';
        return `${indent}<div${safeProps}>\n${childrenCode}\n${indent}</div>`;
      
      case 'text':
        return `${indent}<p${safeProps}>${el.props.text}</p>`;
      
      case 'heading':
        return `${indent}<h2${safeProps}>${el.props.text}</h2>`;
      
      case 'button':
        return `${indent}<button${safeProps}>${el.props.text}</button>`;
      
      case 'image':
        return `${indent}<img${safeProps} />`;

      case 'video':
        return `${indent}<video${safeProps} controls />`;

      case 'iframe':
        return `${indent}<iframe${safeProps} title="embedded-content" />`;

      case 'input':
        return `${indent}<input${safeProps} />`;

      case 'adsense-unit':
        // Generate the ad unit logic. Note: The script in index.html handles loading.
        // We need to trigger the push.
        const layoutAttr = el.props.layoutKey ? ` data-ad-layout-key="${el.props.layoutKey}"` : '';
        return `${indent}{/* Ad Unit */}\n` +
               `${indent}<div${safeProps}>\n` +
               `${indent}   <ins className="adsbygoogle"\n` +
               `${indent}        style={{ display: 'block' }}\n` +
               `${indent}        data-ad-client="${integrations?.googleAdSenseId || 'ca-pub-0000000000000000'}"\n` +
               `${indent}        data-ad-slot="${el.props.slotId}"\n` +
               `${indent}        data-ad-format="${el.props.format || 'auto'}"\n` +
               `${indent}        data-full-width-responsive="true"${layoutAttr}></ins>\n` +
               `${indent}   <script>\n` +
               `${indent}     (adsbygoogle = window.adsbygoogle || []).push({});\n` +
               `${indent}   </script>\n` +
               `${indent}</div>`;

      case 'card':
         return `${indent}<div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">\n` +
                `${indent}  <h3 className="text-xl font-bold text-slate-800 mb-2">${el.props.title}</h3>\n` +
                `${indent}  <p className="text-slate-600">${el.props.content}</p>\n` +
                `${indent}</div>`;
      
      case 'blog-grid':
          return `${indent}{/* CMS Blog Grid */}\n` +
                 `${indent}<div${safeProps}>\n` +
                 `${indent}  {posts.filter(p => p.status === 'published').map(post => (\n` +
                 `${indent}    <div key={post.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">\n` +
                 `${indent}      <div className="h-48 bg-slate-200 w-full" />\n` +
                 `${indent}      <div className="p-4">\n` +
                 `${indent}         <span className="text-xs font-semibold text-blue-600 mb-2 block">{post.date}</span>\n` +
                 `${indent}         <h4 className="text-lg font-bold text-slate-900 mb-2">{post.title}</h4>\n` +
                 `${indent}         <p className="text-slate-600 text-sm">By {post.author}</p>\n` +
                 `${indent}      </div>\n` +
                 `${indent}    </div>\n` +
                 `${indent}  ))}\n` +
                 `${indent}</div>`;

      default:
        return '';
    }
  }).join('\n');
};

export const generateProjectFiles = (pages: Page[], posts: readonly BlogPost[], integrations?: IntegrationsConfig) => {
  const files: Record<string, string> = {};

  // 1. Package JSON
  files['package.json'] = `{
  "name": "nexcore-project",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}`;

  // 2. Configs
  files['vite.config.js'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

  files['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  // 3. HTML Injection (Analytics & AdSense)
  let analyticsScript = '';
  if (integrations?.googleAnalyticsId) {
    analyticsScript = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${integrations.googleAnalyticsId}');
    </script>`;
  }

  let adsenseScript = '';
  if (integrations?.googleAdSenseId) {
    adsenseScript = `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${integrations.googleAdSenseId}"
     crossorigin="anonymous"></script>`;
  }

  files['index.html'] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexcore Site</title>
    ${analyticsScript}
    ${adsenseScript}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

  files['src/index.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  @apply bg-slate-950 text-slate-200;
}`;

  // 4. Main Entry
  files['src/main.jsx'] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`;

  // 5. Router App
  files['src/App.jsx'] = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
${pages.map(p => `import ${p.name.replace(/\s+/g, '')} from './pages/${p.name.replace(/\s+/g, '')}';`).join('\n')}

export default function App() {
  return (
    <Routes>
      ${pages.map(p => `<Route path="${p.slug === '/' ? '/' : p.slug}" element={<${p.name.replace(/\s+/g, '')} />} />`).join('\n      ')}
    </Routes>
  );
}`;

  // 6. Generate Pages
  pages.forEach(page => {
    const componentName = page.name.replace(/\s+/g, '');
    files[`src/pages/${componentName}.jsx`] = `import React from 'react';
    
// Mock Data from CMS
const posts = ${JSON.stringify(posts, null, 2)};

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-slate-950">
${generateComponentJSX(page.elements, 4, integrations)}
    </div>
  );
}`;
  });

  return files;
};

export const downloadProjectZip = async (pages: Page[], posts: readonly BlogPost[], integrations?: IntegrationsConfig) => {
  const files = generateProjectFiles(pages, posts, integrations);
  const zip = new JSZip();

  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'nexcore-project.zip');
};
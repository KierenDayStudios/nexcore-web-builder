import { Page, SiteElement, BlogPost } from '../types';

/**
 * Traverses the site tree and generates a Markdown representation
 * of the current project structure. This serves as the "System Context"
 * for any connected AI.
 */
export const generateSystemContext = (pages: Page[], posts: readonly BlogPost[]): string => {
  const timestamp = new Date().toISOString();
  
  let context = `# PROJECT CONTEXT CHECKPOINT: ${timestamp}\n\n`;
  
  // 1. Structure Summary
  context += `## 1. SITE STRUCTURE\n`;
  context += `Total Pages: ${pages.length}\n`;
  context += `Total Blog Posts: ${posts.length}\n\n`;

  // 2. Page Details
  context += `## 2. PAGE ARCHITECTURE\n`;
  pages.forEach(page => {
    context += `### Page: ${page.name} (${page.slug})\n`;
    context += `Elements Tree:\n`;
    context += renderElementTree(page.elements, 0);
    context += `\n`;
  });

  // 3. Content Summary
  context += `## 3. CMS CONTENT\n`;
  posts.forEach(post => {
    context += `- [${post.status.toUpperCase()}] ${post.title} (Author: ${post.author})\n`;
    if (post.excerpt) {
      context += `  Summary: ${post.excerpt}\n`;
    }
  });

  return context;
};

const renderElementTree = (elements: SiteElement[], depth: number): string => {
  return elements.map(el => {
    const indent = '  '.repeat(depth);
    
    // Extract key props for context clarity
    let propsSummary = '';
    if (el.type === 'text' || el.type === 'heading' || el.type === 'button') {
      propsSummary = `"${el.props.text?.substring(0, 50)}${el.props.text?.length > 50 ? '...' : ''}"`;
    } else if (el.type === 'image') {
      propsSummary = `Src: ${el.props.src}`;
    } else if (el.type === 'container') {
      const classes = el.props.className || '';
      if (classes.includes('flex')) propsSummary += 'Layout: Flex ';
      if (classes.includes('grid')) propsSummary += 'Layout: Grid ';
    }

    const propString = propsSummary ? ` | ${propsSummary}` : '';
    
    let output = `${indent}- [${el.type.toUpperCase()}] ID:${el.id.substring(0, 4)} ${propString}\n`;
    
    if (el.children && el.children.length > 0) {
      output += renderElementTree(el.children, depth + 1);
    }
    
    return output;
  }).join('');
};
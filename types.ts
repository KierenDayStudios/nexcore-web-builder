import { LucideIcon } from 'lucide-react';

export type ElementType = 'container' | 'heading' | 'text' | 'button' | 'image' | 'hero' | 'card' | 'input' | 'textarea' | 'blog-grid' | 'video' | 'iframe' | 'adsense-unit';

export interface ComponentConfig {
  type: ElementType;
  label: string;
  icon: LucideIcon;
  defaultProps: Record<string, any>;
  defaultChildren?: SiteElement[];
}

export interface SiteElement {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  children?: SiteElement[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  elements: SiteElement[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  status: 'published' | 'draft';
  date: string;
  author: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  pages: Page[];
}

// --- COURSE TYPES ---

export interface CourseStep {
  title: string;
  content: string;
  hint?: string;
}

export interface Course {
  id: string;
  title: string;
  totalSteps: number;
  steps: CourseStep[];
}

// --- CONFIGURATION TYPES ---

export interface IntegrationsConfig {
  googleAnalyticsId?: string; // G-XXXXXXXXXX
  googleAdSenseId?: string;   // pub-xxxxxxxxxxxxxxxx
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string; // For custom endpoints
  temperature: number;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  content: string; // The actual text content read from the file
  size: number;
  type: string;
  lastModified: number;
}

export interface ProjectBackup {
  version: string;
  timestamp: number;
  pages: Page[];
  posts: readonly BlogPost[];
  integrations: IntegrationsConfig;
  aiConfig: AIConfig;
  knowledgeFiles: KnowledgeFile[];
}

export type ViewMode = 'visual' | 'code';
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
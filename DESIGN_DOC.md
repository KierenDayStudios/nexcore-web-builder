# NexusBuilder Design Document

## 1. Executive Summary
NexusBuilder is a modern, developer-friendly website builder that bridges the gap between visual drag-and-drop ease and professional code quality. It is designed to empower users to build layouts visually, manage content via a headless-style CMS, and deploy directly to production using Git-based workflows.

## 2. Product Vision & Sketch Alignment
Based on the conceptual sketches, the application focuses on four key pillars:
1.  **Visual Building**: A flexible "Canvas" for dragging and dropping DOM elements.
2.  **Code Transparency**: A "Code View" that exposes the underlying React + Tailwind architecture, ensuring developers are never locked in.
3.  **Content Management**: A dedicated "CMS" module for managing Blogs and Forms data separate from the presentation layer.
4.  **DevOps Integration**: Native-feeling workflows for syncing with GitHub and deploying to static hosts (e.g., Netlify).

## 3. Architecture

### 3.1. Tech Stack
*   **Core**: React 19 (ES Modules).
*   **Styling**: Tailwind CSS (via CDN for runtime simplicity).
*   **Icons**: Lucide React.
*   **State Management**: Centralized reducer pattern for the Site Tree.

### 3.2. Data Model (The Site Tree)
The website is stored as a recursive JSON tree structure, allowing for infinite nesting of components.
```typescript
interface SiteElement {
  id: string;
  type: 'container' | 'heading' | 'text' | 'button' | 'image' | 'input' | 'card';
  props: Record<string, any>; // Tailwind classes, content, src, etc.
  children?: SiteElement[];
}
```

## 4. User Interface Specification

### 4.1. The Sidebar (Navigation)
*   **Builder**: Access the visual editor.
*   **CMS**: Access blog posts and form data.
*   **Deploy**: Manage GitHub sync and production builds.

### 4.2. The Builder Workspace
*   **Left Panel (Palette)**:
    *   Draggable primitives: Containers, Text, Buttons, Images.
    *   Form Elements: Inputs, Textareas (New!).
    *   Pre-built Components: Hero Sections, Cards.
*   **Center (Canvas)**:
    *   Live rendering of the component tree.
    *   Device toggles (Mobile/Tablet/Desktop) for responsive testing.
    *   Selection and deletion controls.
*   **Right Panel (Properties)**:
    *   Edit content (text, image sources).
    *   Edit styling (direct Tailwind class manipulation).

### 4.3. The Code View
*   Read-only display of the generated React code.
*   Real-time updates as the canvas changes.
*   One-click copy to clipboard.

### 4.4. CMS Dashboard
*   Table view of content (Blogs).
*   Status indicators (Published/Draft).
*   Search and filter capabilities.

### 4.5. Deployment View
*   Visualizes the CI/CD pipeline.
*   Steps: Sync to GitHub -> Build -> Upload -> Live.
*   History log of previous deployments.

## 5. Future Roadmap
*   **Multi-page Support**: Routing configuration.
*   **Backend Integration**: Connecting to a real Supabase/Firebase instance.
*   **Theme Editor**: Global variable management for colors/fonts.

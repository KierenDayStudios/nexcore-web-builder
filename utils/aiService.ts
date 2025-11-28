import { GoogleGenAI } from "@google/genai";
import { AIConfig, SiteElement } from "../types";

export const generateAIContent = async (
  config: AIConfig,
  prompt: string,
  context: string,
  currentText?: string
): Promise<string> => {
  if (!config.apiKey && config.provider !== 'custom') {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  const fullPrompt = `
    You are a helpful UX Writer and Content Strategist assisting a user build a website.
    
    PROJECT CONTEXT:
    ${context}

    CURRENT TEXT: "${currentText || ''}"

    TASK:
    ${prompt}

    GUIDELINES:
    - Return ONLY the revised text. Do not include quotes, explanations, or conversational filler.
    - Keep the tone consistent with the project context if clear, otherwise assume a professional, modern web style.
    - If the user asks for a specific format (e.g. "shorter"), prioritize that.
  `;

  try {
    if (config.provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      const response = await ai.models.generateContent({
        model: config.model || 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      return response.text?.trim() || '';
    }

    if (config.provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o',
          messages: [
            { role: "system", content: "You are a professional website copywriter." },
            { role: "user", content: fullPrompt }
          ],
          temperature: config.temperature
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content?.trim() || '';
    }

    if (config.provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model || 'claude-3-opus-20240229',
          max_tokens: 1024,
          messages: [{ role: "user", content: fullPrompt }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.content?.[0]?.text?.trim() || '';
    }

    // Custom
    if (config.provider === 'custom') {
      const response = await fetch(`${config.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });
      const data = await response.json();
      return data.response || data.content || data.text || JSON.stringify(data);
    }

    throw new Error("Provider not supported");
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

/**
 * Generates a full component tree (JSON) based on a user description.
 */
export const generateLayout = async (
  config: AIConfig,
  prompt: string,
  context: string
): Promise<SiteElement[]> => {
  if (!config.apiKey && config.provider !== 'custom') {
    throw new Error("API Key is missing.");
  }

  const systemPrompt = `
    You are an expert React/Tailwind web developer. 
    Your task is to generate a JSON structure representing a website section based on the user's description.
    
    OUTPUT FORMAT:
    Return a valid JSON Array of "SiteElement" objects.
    
    INTERFACE:
    interface SiteElement {
      id: string; // generate random string
      type: 'container' | 'heading' | 'text' | 'button' | 'image' | 'video' | 'input' | 'card';
      props: {
        className?: string; // Tailwind CSS classes
        text?: string; // Content for text/heading/button
        src?: string; // URL for image/video
        placeholder?: string; // For inputs
        style?: Record<string, string>; // Inline styles if strictly necessary (avoid if possible)
      };
      children?: SiteElement[];
    }

    RULES:
    - Use Tailwind CSS for all styling (padding, colors, layout, typography).
    - Use 'container' with flex/grid classes for layout.
    - Provide realistic placeholder text/images if not specified.
    - Do NOT include any markdown formatting (like \`\`\`json). Just return the raw JSON string.
    - Ensure valid JSON syntax.
    
    PROJECT CONTEXT:
    ${context}
  `;

  try {
    let jsonString = '';

    if (config.provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      const response = await ai.models.generateContent({
        model: config.model || 'gemini-2.5-flash',
        contents: systemPrompt + `\n\nUSER REQUEST: ${prompt}`,
        config: { responseMimeType: 'application/json' }
      });
      jsonString = response.text || '[]';
    } 
    else if (config.provider === 'openai') {
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o',
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });
      const data = await response.json();
      jsonString = data.choices?.[0]?.message?.content || '[]';
    }
    else {
      // Fallback for others (hope for the best regarding JSON)
      const raw = await generateAIContent(config, "Return only valid JSON representing the component structure.", context, prompt);
      jsonString = raw.replace(/```json/g, '').replace(/```/g, '');
    }

    // Parse and Validate
    const result = JSON.parse(jsonString);
    
    // Ensure it's an array
    const elements = Array.isArray(result) ? result : [result];
    
    // Quick sanitization of IDs to ensure uniqueness
    const sanitize = (els: any[]): SiteElement[] => {
      return els.map(el => ({
        ...el,
        id: Math.random().toString(36).substr(2, 9),
        children: el.children ? sanitize(el.children) : undefined
      }));
    };

    return sanitize(elements);

  } catch (error) {
    console.error("Layout Generation Error:", error);
    throw new Error("Failed to generate layout. The AI response was not valid JSON.");
  }
};
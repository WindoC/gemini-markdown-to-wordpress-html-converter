import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function convertToHtmlStream(
  markdown: string,
  onStreamUpdate: (chunk: string) => void
): Promise<void> {
  // const prompt = `
  //   You are an expert web developer specializing in creating clean, semantic HTML for WordPress blogs. Your task is to convert the following Markdown text into HTML.

  //   **CRITICAL RULES:**
  //   1.  **DO NOT** include \`<html>\`, \`<head>\`, or \`<body>\` tags.
  //   2.  **DO NOT** include any CSS, \`<style>\` tags, or inline \`style\` attributes.
  //   3.  The output must be **ONLY** the HTML content that would go inside the WordPress post editor's 'Text' or 'Code' view.
  //   4.  Ensure all Markdown syntax (headings, paragraphs, lists, links, images, code blocks, blockquotes, bold, italic, etc.) is correctly converted to its corresponding semantic HTML tag.
  //   5.  For code blocks, use \`<pre><code class="language-...">...</code></pre>\` and correctly escape any HTML entities within the code itself. Infer the language if possible.
  //   6.  Ensure the output is well-formed HTML.
  //   7.  **DO NOT** wrap the final output in a markdown code block (e.g., \`\`\`html ... \`\`\`). The output must be the raw HTML itself.

  //   Here is the Markdown content to convert:
  //   ---
  //   ${markdown}
  //   ---
  // `;

  const systemInstruction = `
convert markdown to wordpress post html.
Ensure the output is well-formed HTML.
The output will use to paste into wordpress post code editor mode direcly. must including the tag <!-- wp:xxx --> ... <!-- /wp:xxx -->

RULE FOR MERMAID DIAGRAMS:
If you find a markdown code block that starts with \`\`\`mermaid\`, you must convert it to the following HTML structure, placing the original mermaid code inside the <pre> tag:
<!-- wp:merpress/mermaidjs -->
<div class="wp-block-merpress-mermaidjs diagram-source-mermaid"><pre class="mermaid">[THE MERMAID CODE GOES HERE]</pre></div>
<!-- /wp:merpress/mermaidjs -->

**GENERAL RULES:**
**DO NOT** include <html>, <head>, or <body> tags.
**DO NOT** include any CSS, <style> tags, or inline "style" attributes.
**DO NOT** wrap the final output in a markdown code block (e.g., \`\`\`html ... \`\`\`). The output must be the raw HTML itself.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: markdown,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1,
      }
    });
    
    for await (const chunk of response) {
      onStreamUpdate(chunk.text);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to convert markdown. Please check your API key and network connection.");
  }
}

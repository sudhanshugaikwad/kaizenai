
'use server';

/**
 * @fileOverview AI-powered website builder.
 *
 * - generateWebsite - A function that generates a complete website from a prompt.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
    WebsiteBuilderInputSchema,
    WebsiteBuilderOutputSchema,
    type WebsiteBuilderInput,
    type WebsiteBuilderOutput
} from './website-builder.types';


export async function generateWebsite(input: WebsiteBuilderInput): Promise<WebsiteBuilderOutput> {
  return generateWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'websiteBuilderPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: WebsiteBuilderInputSchema},
  output: {schema: WebsiteBuilderOutputSchema},
  prompt: `You are an expert web developer specializing in creating modern, responsive, and professional websites using HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap. Your task is to generate the complete code for a single-page website based on the user's requirements.

  **Website Details:**
  - **Name:** {{{name}}}
  - **Technologies:** {{{languages}}}
  - **Prompt:** {{{prompt}}}

  **Instructions:**
  1. **Generate a complete, runnable \`index.html\` file.**  
     - It must be a full HTML document including \`<!DOCTYPE html>\`, \`<html>\`, \`head\`, and \`<body>\` tags.  
     - Include a consistent **navigation bar and footer**. The navigation must be responsive and functional (e.g., hamburger menu on mobile).

  2. **Inside the \`<head>\`:**
     - Add a \`<title>\` tag using the website name.  
     - Include the necessary **CDN links for Tailwind CSS (v3), Bootstrap (v5), and Bootstrap Icons**.
     - Link to an external stylesheet named "style.css".  

  3. **Generate the complete CSS code for \`style.css\`**:  
     - Add custom styles that complement Tailwind/Bootstrap.  
     - Use modern CSS practices for a professional look (e.g., smooth transitions, subtle shadows).
     - Ensure consistent branding, typography, spacing, and color schemes.  

  4. **Generate the JavaScript code for \`script.js\`**:  
     - Include functionality for a **responsive mobile navigation menu toggle**.
     - Add interactivity required by the user’s prompt (e.g., smooth scrolling, form validation).  
     - Link this file before the closing \`</body>\` tag.  
     - If no interactivity is required, keep the script minimal but functional for the navbar.  

  5. **Design and Content:**
     - Use semantic HTML tags (\`header\`, \`nav\`, \`main\`, \`section\`, \`footer\`).  
     - Create a professional, modern, and visually appealing layout. Sections should be well-defined and flow logically.
     - Populate the site with high-quality, relevant placeholder text and images based on the user's prompt. Use "https://picsum.photos/width/height" for placeholder images.

  The final output must be a **ready-to-run, single-page responsive website** with clean, well-structured, and professional-quality code.
  `,
});

const generateWebsiteFlow = ai.defineFlow(
  {
    name: 'generateWebsiteFlow',
    inputSchema: WebsiteBuilderInputSchema,
    outputSchema: WebsiteBuilderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

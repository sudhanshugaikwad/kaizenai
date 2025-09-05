
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
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: WebsiteBuilderInputSchema},
  output: {schema: WebsiteBuilderOutputSchema},
  prompt: `You are an expert web developer specializing in creating modern, responsive, and professional websites using HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap. Your task is to generate the complete code for a multi-page website based on the user's requirements.

  **Website Details:**
  - **Name:** {{{name}}}
  - **Technologies:** {{{languages}}}
  - **Prompt:** {{{prompt}}}

  **Instructions:**
  1. **Generate a complete, runnable HTML file for each required page** (e.g., \`index.html\`, \`about.html\`, \`services.html\`, \`contact.html\`, or others based on the user prompt).  
     - Each file must be a full HTML document including \`<!DOCTYPE html>\`, \`<html>\`, \`head\`, and \`<body>\` tags.  
     - Include a consistent **navigation bar and footer** across all pages.  

  2. Inside the \`<head>\` of every page:
     - Add a \`<title>\` tag using the website name + page name.  
     - Include the necessary **CDN links for Tailwind CSS (v3) and Bootstrap (v5)**.  
     - Link to an external stylesheet named "style.css".  

  3. **Generate the complete CSS code for \`style.css\`**:  
     - Add custom styles that complement Tailwind/Bootstrap.  
     - Use modern CSS practices.  
     - Ensure consistent branding, typography, spacing, and color schemes across all pages.  

  4. **Generate the JavaScript code for \`script.js\`**:  
     - Include functionality for navigation (mobile menu toggle, smooth scrolling, etc.).  
     - Add interactivity required by the user’s prompt (sliders, modals, form validation, etc.).  
     - Link this file before the closing \`</body>\` tag on every page.  
     - If no interactivity is required, keep the script minimal but linked.  

  5. **Responsive Design:**  
     - Ensure the website is fully responsive on mobile, tablet, and desktop.  
     - Use a mix of Tailwind/Bootstrap utility classes and media queries in \`style.css\`.  

  6. **Design Quality:**  
     - Use semantic HTML tags (\`header\`, \`nav\`, \`main\`, \`section\`, \`article\`, \`footer\`).  
     - Create a professional, modern, and visually appealing layout.  
     - Maintain consistent design across all pages.  

  7. **Output Format:**  
     - Provide the full code for:  
       - \`index.html\` and additional pages as required  
       - \`style.css\`  
       - \`script.js\`  

  The final output must be a **ready-to-run, multi-page responsive website** with clean and well-structured code.`,
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

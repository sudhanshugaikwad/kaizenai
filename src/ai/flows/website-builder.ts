
'use server';

/**
 * @fileOverview AI-powered website builder.
 *
 * - generateWebsite - A function that generates a complete website from a prompt.
 */

import {ai} from '@/ai/genkit';
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
  input: {schema: WebsiteBuilderInputSchema},
  output: {schema: WebsiteBuilderOutputSchema},
  prompt: `You are an expert web developer who specializes in creating modern, responsive, and user-friendly websites. Your task is to generate the complete code for a single-page website based on the user's requirements.

  **Website Details:**
  - **Name:** {{{name}}}
  - **Technologies:** {{{languages}}}
  - **Prompt:** {{{prompt}}}

  **Instructions:**
  1.  Generate a complete, runnable HTML file. It must be a full HTML document, including \`<!DOCTYPE html>\`, \`<html>\`, \`head\`, and \`<body>\` tags.
  2.  Inside the \`<head>\`, include a \`<title>\` tag using the website name.
  3.  **Crucially, you must include the necessary CDN links for both Tailwind CSS and Bootstrap** to ensure the website is styled correctly. Also, link to an external stylesheet named "style.css".
  4.  Generate the complete CSS code for "style.css". This file should contain any custom styles that complement the utility classes from the frameworks.
  5.  If the prompt requires interactivity (e.g., image sliders, form submissions), generate the necessary JavaScript code. Link to an external script file named "script.js" just before the closing \`</body>\` tag. If no JavaScript is needed, you can leave the javascript field empty.
  6.  The generated code must be clean, well-commented, and easy for a user to understand and modify.
  7.  Ensure the final website is **fully responsive** and works well on all screen sizes, from mobile to desktop. Use responsive classes from Bootstrap or Tailwind CSS extensively.
  8.  Create a professional and aesthetically pleasing design based on the user's prompt.

  Produce the full code for each file (HTML, CSS, and JavaScript).
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

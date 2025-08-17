
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
  prompt: `You are an expert web developer specializing in creating modern, responsive, and professional websites using HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap. Your task is to generate the complete code for a single-page website based on the user's requirements.

  **Website Details:**
  - **Name:** {{{name}}}
  - **Technologies:** {{{languages}}}
  - **Prompt:** {{{prompt}}}

  **Instructions:**
  1.  **Generate a complete, runnable HTML file** named \`index.html\`. It must be a full HTML document, including \`<!DOCTYPE html>\`, \`<html>\`, \`head\`, and \`<body>\` tags.
  2.  Inside the \`<head>\`, include a \`<title>\` tag using the website name.
  3.  **Crucially, you must include the necessary CDN links for both Tailwind CSS (v3) and Bootstrap (v5)** to ensure the website is styled correctly. Also, link to an external stylesheet named "style.css".
  4.  Generate the complete CSS code for **\`style.css\`**. This file should contain any custom styles that complement the utility classes from the frameworks. Use modern CSS practices.
  5.  If the prompt requires interactivity (e.g., image sliders, form submissions, dynamic content), generate the necessary JavaScript code in a file named **\`script.js\`**. Link to this external script just before the closing \`</body>\` tag. If no JavaScript is needed, you can leave the javascript field empty.
  6.  The generated code must be **clean, well-structured, and easy for a user to understand and modify**. Use semantic HTML tags.
  7.  Ensure the final website is **fully responsive** and works well on all screen sizes, from mobile to desktop. Use responsive design principles, combining utility classes from Tailwind/Bootstrap with media queries in your custom CSS where necessary.
  8.  Create a **professional and aesthetically pleasing design** based on the user's prompt. Pay attention to spacing, typography, and color schemes.

  Produce the full code for each of the three files: \`index.html\`, \`style.css\`, and \`script.js\`.
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


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
  prompt: `You are an expert web developer. Your task is to generate the complete code for a single-page website based on the user's requirements.

  **Website Details:**
  - **Name:** {{{name}}}
  - **Technologies:** {{{languages}}}
  - **Prompt:** {{{prompt}}}

  **Instructions:**
  1.  Generate the complete, runnable HTML code. It must be a full HTML document including <!DOCTYPE html>, <html>, <head>, and <body> tags.
  2.  Inside the <head>, include a <title> tag using the website name.
  3.  Link to an external stylesheet named "style.css" like this: <link rel="stylesheet" href="style.css">.
  4.  Generate the complete CSS code for "style.css".
  5.  If the prompt requires interactivity, generate the necessary JavaScript code. Link to an external script file named "script.js" just before the closing </body> tag like this: <script src="script.js"></script>. If no JavaScript is needed, you can leave the javascript field empty.
  6.  The code should be modern, clean, and responsive. Use CSS Flexbox or Grid for layout.
  7.  Do not use any external libraries or frameworks unless specified in the 'Technologies' input.

  Produce the full code for each file.
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

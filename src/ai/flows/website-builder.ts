
'use server';

/**
 * @fileOverview AI-powered website builder.
 *
 * - generateWebsite - A function that generates a complete website from a prompt.
 * - WebsiteBuilderInput - The input type for the generateWebsite function.
 * - WebsiteBuilderOutput - The return type for the generateWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const WebsiteBuilderInputSchema = z.object({
  name: z.string().describe('The name of the website.'),
  purpose: z.string().describe('The main purpose or goal of the website.'),
  languages: z.string().describe('The programming languages or frameworks to be used (e.g., "HTML, CSS, JavaScript", "React").'),
  prompt: z.string().describe('A detailed prompt describing the desired website content, layout, and style.'),
});
export type WebsiteBuilderInput = z.infer<typeof WebsiteBuilderInputSchema>;

export const WebsiteBuilderOutputSchema = z.object({
    html: z.string().describe('The complete HTML code for the website.'),
    css: z.string().describe('The complete CSS code for styling the website.'),
    javascript: z.string().optional().describe('The JavaScript code for any interactive functionality.'),
});
export type WebsiteBuilderOutput = z.infer<typeof WebsiteBuilderOutputSchema>;

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
  - **Purpose:** {{{purpose}}}
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

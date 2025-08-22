
'use server';

/**
 * @fileOverview AI-powered website editor.
 *
 * - editWebsite - A function that edits a website based on a prompt.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
    WebsiteBuilderOutputSchema,
    type WebsiteBuilderOutput
} from './website-builder.types';
import { z } from 'genkit';

const WebsiteEditorInputSchema = z.object({
  html: z.string().describe('The current HTML code of the website.'),
  css: z.string().describe('The current CSS code of the website.'),
  javascript: z.string().optional().describe('The current JavaScript code of the website.'),
  prompt: z.string().describe('A detailed prompt describing the desired changes to the website.'),
});
export type WebsiteEditorInput = z.infer<typeof WebsiteEditorInputSchema>;

export async function editWebsite(input: WebsiteEditorInput): Promise<WebsiteBuilderOutput> {
  return editWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'websiteEditorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: WebsiteEditorInputSchema},
  output: {schema: WebsiteBuilderOutputSchema},
  prompt: `You are an expert web developer specializing in editing websites using HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap. Your task is to modify the provided website code based on the user's instructions.

  **User's Change Request:** {{{prompt}}}

  **Instructions:**
  1.  Analyze the user's prompt and the existing code.
  2.  Generate the **complete, updated code** for all three files: \`index.html\`, \`style.css\`, and \`script.js\`.
  3.  **Return the entire file content for each file**, not just the changed parts.
  4.  Ensure the code remains clean, well-structured, and fully responsive.
  5.  If the user asks for a change that would be better handled by a different framework (e.g. "add a React component"), you should still fulfill the request using the existing technologies (HTML/CSS/JS) as best as possible. Do not introduce new frameworks.
  6.  Preserve existing CDN links for Tailwind CSS and Bootstrap.

  **Current HTML (\`index.html\`):**
  \`\`\`html
  {{{html}}}
  \`\`\`

  **Current CSS (\`style.css\`):**
  \`\`\`css
  {{{css}}}
  \`\`\`

  **Current JavaScript (\`script.js\`):**
  \`\`\`javascript
  {{{javascript}}}
  \`\`\`

  Now, provide the complete and updated code for each file based on the user's request.
  `,
});

const editWebsiteFlow = ai.defineFlow(
  {
    name: 'editWebsiteFlow',
    inputSchema: WebsiteEditorInputSchema,
    outputSchema: WebsiteBuilderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

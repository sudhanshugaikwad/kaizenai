
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
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: WebsiteEditorInputSchema},
  output: {schema: WebsiteBuilderOutputSchema},
  prompt: `You are an expert web developer specializing in creating modern, professional, and accessible websites using HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap. Your task is to modify the provided website code based on the user's instructions, ensuring a polished and responsive UI.

  **User's Change Request:** {{{prompt}}}

  **Instructions:**
  1. Analyze the user's prompt and the existing code.
  2. Generate the **complete, updated code** for all three files: \`index.html\`, \`style.css\`, and \`script.js\`.
  3. **Return the entire file content for each file**, not just the changed parts.
  4. Ensure the code is:
     - **Professional and Modern**: Use clean typography, consistent color schemes, and modern design principles (e.g., minimalistic layouts, smooth animations).
     - **Responsive**: Optimize for all screen sizes using Tailwind CSS responsive classes or Bootstrap's grid system.
     - **Accessible**: Include semantic HTML, ARIA attributes, and proper contrast ratios.
     - **Performant**: Minimize CSS/JavaScript bloat and optimize for fast loading.
  5. If the user requests features requiring frameworks (e.g., React components), implement them using vanilla HTML/CSS/JS, Tailwind CSS, or Bootstrap as best as possible.
  6. Preserve existing CDN links for Tailwind CSS and Bootstrap.
  7. Ensure code is well-structured, commented, and maintainable.
  8. Use Tailwind CSS for primary styling, with Bootstrap for grid or component utilities if needed.

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

  Now, provide the complete and updated code for each file based on the user's request, prioritizing a professional and modern UI.
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

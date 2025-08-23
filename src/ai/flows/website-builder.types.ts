
/**
 * @fileOverview Type definitions for the website builder AI flow.
 */
import {z} from 'genkit';

export const WebsiteBuilderInputSchema = z.object({
  name: z.string().describe('The name of the website.'),
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

    
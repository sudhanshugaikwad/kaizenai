
'use server';

/**
 * @fileOverview An AI agent that generates a detailed website prompt from a name.
 *
 * - generateWebsitePrompt - A function that handles prompt generation.
 * - WebsitePromptGeneratorInput - The input type for the function.
 * - WebsitePromptGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const WebsitePromptGeneratorInputSchema = z.object({
  websiteName: z.string().describe('The name of the website to generate a prompt for.'),
});
export type WebsitePromptGeneratorInput = z.infer<typeof WebsitePromptGeneratorInputSchema>;

const WebsitePromptGeneratorOutputSchema = z.object({
  prompt: z.string().describe('The detailed, generated prompt for the website.'),
});
export type WebsitePromptGeneratorOutput = z.infer<typeof WebsitePromptGeneratorOutputSchema>;

export async function generateWebsitePrompt(input: WebsitePromptGeneratorInput): Promise<WebsitePromptGeneratorOutput> {
  return generateWebsitePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'websitePromptGenerator',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: WebsitePromptGeneratorInputSchema},
  output: {schema: WebsitePromptGeneratorOutputSchema},
  prompt: `You are a creative director and prompt engineer. Based on the provided website name, generate a detailed and descriptive prompt for an AI web developer to build a modern, professional, and responsive single-page website.

  **Website Name:** {{{websiteName}}}

  **Instructions:**
  1.  **Infer the Purpose:** Based on the website name, infer the likely purpose (e.g., portfolio, small business, event, blog).
  2.  **Describe the Vibe:** Suggest a color scheme (e.g., "modern and clean with a palette of blues, whites, and a touch of gold for accents") and a visual style (e.g., "minimalist", "corporate", "artistic").
  3.  **Outline the Sections:** Detail the essential sections for the website. Common sections include:
      - A compelling **Hero Section** with a strong headline, a brief tagline, and a clear call-to-action button.
      - An **About Us/Me Section** to introduce the person or company.
      - A **Services/Features Section** to highlight key offerings, perhaps using cards with icons.
      - A **Portfolio/Gallery Section** to showcase work (if applicable).
      - A **Testimonials Section** to build trust.
      - A simple **Contact Section** with a form (name, email, message) and social media links.
  4.  **Suggest Interactivity:** Recommend subtle animations or interactive elements (e.g., "on-scroll fade-in effects for sections," "a hover effect on portfolio items").
  5.  **Structure the Output:** Format the final output as a single, coherent block of text that can be directly used as a prompt.
  `,
});

const generateWebsitePromptFlow = ai.defineFlow(
  {
    name: 'generateWebsitePromptFlow',
    inputSchema: WebsitePromptGeneratorInputSchema,
    outputSchema: WebsitePromptGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
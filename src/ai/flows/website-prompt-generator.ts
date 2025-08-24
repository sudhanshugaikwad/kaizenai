
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
  model: googleAI.model('gemini-pro'),
  input: {schema: WebsitePromptGeneratorInputSchema},
  output: {schema: WebsitePromptGeneratorOutputSchema},
  prompt: `You are a creative director and prompt engineer specializing in modern, professional, and accessible web design. Based on the provided website name, generate a detailed and descriptive prompt for an AI web developer to build a single-page website with a polished, responsive, and user-friendly UI using HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap.

  **Website Name:** {{{websiteName}}}

  **Instructions:**
  1. **Infer the Purpose:** Based on the website name, infer the likely purpose (e.g., portfolio, small business, event, blog).
  2. **Describe the Vibe:** Suggest a modern and professional color scheme (e.g., "clean and elegant with a palette of navy blue, crisp white, and subtle coral accents") and a visual style (e.g., "minimalist with bold typography", "corporate with sleek transitions", "creative with vibrant imagery").
  3. **Outline the Sections:** Detail the essential sections for a professional UI, including:
     - A **Hero Section** with a bold headline, concise tagline, and a prominent call-to-action button (e.g., "Get Started" or "Contact Us").
     - An **About Us/Me Section** with a professional introduction and a high-quality image or icon.
     - A **Services/Features Section** using responsive cards with icons or images for key offerings.
     - A **Portfolio/Gallery Section** (if applicable) with a grid layout and hover effects.
     - A **Testimonials Section** with quotes or reviews to build trust, styled as cards or a carousel.
     - A **Contact Section** with a clean form (name, email, message) and social media icons linked to profiles.
  4. **Specify Interactivity:** Recommend subtle animations (e.g., "fade-in effects on scroll for sections", "smooth hover transitions on buttons and cards") and interactive elements (e.g., "a sticky navigation bar that highlights the active section").
  5. **Emphasize Professional UI Principles:**
     - **Responsive Design:** Ensure the layout adapts seamlessly to mobile, tablet, and desktop using Tailwind CSS responsive classes or Bootstrap's grid system.
     - **Accessibility:** Include semantic HTML, ARIA attributes, keyboard navigation support, and high-contrast color ratios.
     - **Performance:** Optimize for fast loading with minimal CSS/JS, compressed images, and efficient code structure.
     - **Consistency:** Use Tailwind CSS for primary styling and Bootstrap for grid or component utilities, maintaining a cohesive design language.
  6. **Structure the Output:** Format the final output as a single, coherent block of text that can be directly used as a prompt for an AI web developer.
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

    

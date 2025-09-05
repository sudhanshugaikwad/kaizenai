
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
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: WebsitePromptGeneratorInputSchema},
  output: {schema: WebsitePromptGeneratorOutputSchema},
  prompt: `You are a creative director and prompt engineer specializing in modern, professional, and accessible web design. Based on the provided website name, generate a detailed and descriptive prompt for an AI web developer to build a single-page website with a polished, responsive, and user-friendly UI using HTML, CSS, JavaScript, Tailwind CSS, Bootstrap, and Bootstrap Icons.

  **Website Name:** {{{websiteName}}}

  **Instructions:**
  1. **Infer the Purpose:** Based on the website name, infer its likely purpose (e.g., portfolio, startup landing page, small business, blog, event, nonprofit).
  2. **Define the Visual Identity:** Suggest a modern and professional color palette (e.g., "navy blue, crisp white, and coral highlights") and a design style (e.g., "minimalist with bold typography", "corporate with sleek transitions", "creative with vibrant visuals").
  3. **Navigation Bar (Default):** Include a responsive sticky navigation bar at the top with smooth scrolling, Bootstrap Icons for section links, and active state highlighting as the user scrolls.
  4. **Outline the Sections:** Specify the essential sections for a polished single-page UI, including:
     - A **Hero Section** with a gradient background, bold headline, concise tagline, and a prominent call-to-action button (e.g., "Get Started" or "Contact Us").
     - An **About Section** with a professional introduction and a high-quality image or icon.
     - A **Services/Features Section** with responsive cards using Bootstrap Icons or custom images.
     - A **Portfolio/Gallery Section** (if applicable) in a grid layout with hover effects.
     - A **Testimonials Section** with styled quotes or reviews, either as cards or a carousel.
     - A **Contact Section** with a clean form (name, email, message) and social media icons.
  5. **Specify Interactivity:** Recommend subtle animations (e.g., "fade-in effects on scroll for sections", "smooth hover transitions on buttons and cards") and interactive elements (e.g., "a sticky navigation bar with active link highlighting").
  6. **Emphasize Professional UI Principles:**
     - **Responsive Design:** Ensure the layout adapts seamlessly across mobile, tablet, and desktop using Tailwind CSS responsive utilities and/or Bootstrap grid system.
     - **Accessibility:** Use semantic HTML, ARIA attributes, support keyboard navigation, and maintain high-contrast color ratios.
     - **Performance:** Optimize for speed with minimal CSS/JS, compressed images, and efficient code structure.
     - **Consistency:** Use Tailwind CSS for utility-first styling, Bootstrap for grid/components, and Bootstrap Icons for visuals, ensuring cohesive design language.
  7. **Structure the Output:** Deliver the final output as a single, coherent block of descriptive text that can directly be used as a prompt for an AI web developer.
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

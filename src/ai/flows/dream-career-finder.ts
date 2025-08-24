
'use server';

/**
 * @fileOverview An AI agent that suggests a dream career based on a quiz.
 *
 * - suggestDreamCareer - A function that handles the career suggestion process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    DreamCareerFinderInputSchema,
    DreamCareerFinderOutputSchema,
    type DreamCareerFinderInput,
    type DreamCareerFinderOutput,
} from './dream-career-finder.types';

export { type DreamCareerFinderInput, type DreamCareerFinderOutput };


export async function suggestDreamCareer(input: DreamCareerFinderInput): Promise<DreamCareerFinderOutput> {
  return dreamCareerFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dreamCareerFinderPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: DreamCareerFinderInputSchema},
  output: {schema: DreamCareerFinderOutputSchema},
  prompt: `You are an expert career coach for a global audience. Your task is to analyze the user's answers from the "Find Your Dream Career" quiz and provide a comprehensive and encouraging recommendation. The user can be a student, a job seeker, or a working professional.

  **User's Profile:**
  - **Category:** {{{userCategory}}}
  {{#if educationLevel}}- **Education Level:** {{{educationLevel}}}{{/if}}
  {{#if interests}}- **Interests:** {{{interests}}}{{/if}}
  {{#if strengths}}- **Strengths:** {{{strengths}}}{{/if}}
  {{#if workStyle}}- **Preferred Work Style:** {{{workStyle}}}{{/if}}
  {{#if motivation}}- **Career Motivation:** {{{motivation}}}{{/if}}
  {{#if currentRole}}- **Current/Previous Role:** {{{currentRole}}}{{/if}}
  {{#if yearsOfExperience}}- **Years of Experience:** {{{yearsOfExperience}}}{{/if}}
  
  **Instructions:**
  1.  **Analyze the Profile:** Carefully consider all the information provided. The user's category is the most important factor.
  2.  **For Students:** If the user is a student, focus on foundational steps.
      - Suggest 2-3 suitable **degree or certification paths** (e.g., "Bachelor of Computer Applications (BCA)", "Certified Data Scientist").
      - Recommend 2-3 specific **career paths** that align with those degrees (e.g., "Web Developer", "Marketing Analyst").
      - Provide **actionable next steps** like "explore online courses on Coursera for this field," or "participate in a hackathon."
  3.  **For Job Seekers/Professionals:** If the user is a job seeker or professional, focus on leveraging their experience.
      - Suggest 2-3 specific **career paths** that are either a direct next step or a logical transition (e.g., "Senior Product Manager", "Transition to UX Research").
      - Provide **actionable next steps** like "update your LinkedIn profile with these keywords," or "network with professionals in this new role."
      - Recommendations for courses should be for upskilling (e.g., "Advanced Leadership Certification").
  4.  **Generate a 'Why This Fits' Explanation:** Write a concise and encouraging explanation for your top recommendation, connecting it directly to the user's answers.
  5.  **Provide 'Career Insights':** Offer a brief, valuable tip or piece of knowledge about the recommended field (e.g., "The field of AI is rapidly growing, with a high demand for prompt engineers.").
  6.  **Find a suitable 'Career Icon':** Select a single emoji that best represents the primary career recommendation.

  Generate a response in the required JSON format.
  `,
});

const dreamCareerFinderFlow = ai.defineFlow(
  {
    name: 'dreamCareerFinderFlow',
    inputSchema: DreamCareerFinderInputSchema,
    outputSchema: DreamCareerFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

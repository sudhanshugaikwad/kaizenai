
'use server';

/**
 * @fileOverview An AI agent that suggests a dream career based on a quiz.
 *
 * - suggestDreamCareer - A function that handles the career suggestion process.
 */

import {ai} from '@/ai/genkit';
import {
    DreamCareerFinderInputSchema,
    DreamCareerFinderOutputSchema,
    type DreamCareerFinderInput,
    type DreamCareerFinderOutput,
} from './dream-career-finder.types';


export async function suggestDreamCareer(input: DreamCareerFinderInput): Promise<DreamCareerFinderOutput> {
  return dreamCareerFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dreamCareerFinderPrompt',
  input: {schema: DreamCareerFinderInputSchema},
  output: {schema: DreamCareerFinderOutputSchema},
  prompt: `You are an expert career coach. Your task is to analyze the user's answers from the "Find Your Dream Career" quiz and suggest a single, most fitting career path. Your audience can be anyone: a student, a job seeker, or a working professional looking for a change. Be friendly, encouraging, and insightful.

  **User's Quiz Answers:**
  - **Enjoys most:** {{{strength}}}
  - **Preferred Work Style:** {{{workStyle}}}
  - **Exciting Subjects/Fields:** {{{interests}}}
  - **Career Motivation:** {{{motivation}}}
  - **Preferred Work Setting:** {{{workSetting}}}

  **Instructions:**
  1.  Based on the combination of answers, determine the single best career suggestion.
  2.  Provide a concise 'whyThisFits' explanation that directly connects their answers to the suggested career. For example, "Your love for 'Problem Solving' and 'Technology' makes you a great fit for..."
  3.  Provide three clear, actionable 'nextSteps' that someone can take to start on this path. These should be suitable for any user, whether they are starting from scratch or transitioning.

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

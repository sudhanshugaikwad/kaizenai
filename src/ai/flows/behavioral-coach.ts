
'use server';

/**
 * @fileOverview An AI agent that coaches users on behavioral interview questions.
 *
 * - coachBehavioralAnswer - A function that handles the coaching process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    BehavioralCoachInputSchema,
    BehavioralCoachOutputSchema,
    type BehavioralCoachInput,
    type BehavioralCoachOutput
} from './behavioral-coach.types';


export async function coachBehavioralAnswer(input: BehavioralCoachInput): Promise<BehavioralCoachOutput> {
  return behavioralCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'behavioralCoachPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: BehavioralCoachInputSchema},
  output: {schema: BehavioralCoachOutputSchema},
  prompt: `You are an expert interview coach specializing in behavioral questions. Your task is to take a user's real-life experience and restructure it into a compelling answer using the STAR (Situation, Task, Action, Result) method. Provide three distinct variations of the answer.

  **User's Experience:**
  {{{experience}}}

  **Instructions:**
  1.  **Analyze the Experience:** Break down the user's input to identify the core Situation, Task, Action, and Result.
  2.  **Generate a Formal Version:** Craft a professional, concise answer suitable for a traditional corporate interview. This version should be polished and directly address the implicit question in the user's story.
  3.  **Generate a Conversational Version:** Create a more natural, story-like answer that would work well in a less formal or startup environment. This version can be slightly more detailed and personal.
  4.  **Generate a Leadership-Focused Version:** Reframe the answer to highlight leadership qualities, such as initiative, problem-solving, impact on the team, and strategic thinking. This version should demonstrate ownership and influence.
  5.  **Provide Feedback:** Offer a brief, constructive tip on how the user could further improve their original story or the new versions.

  Generate the response in the required JSON format.
  `,
});

const behavioralCoachFlow = ai.defineFlow(
  {
    name: 'behavioralCoachFlow',
    inputSchema: BehavioralCoachInputSchema,
    outputSchema: BehavioralCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

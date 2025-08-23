
'use server';

/**
 * @fileOverview AI-powered behavioral interview coach.
 *
 * - rewriteWithSTAR - A function that rewrites a user's experience using the STAR method.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { 
    BehavioralCoachInputSchema, 
    BehavioralCoachOutputSchema,
    type BehavioralCoachInput,
    type BehavioralCoachOutput
} from './behavioral-coach.types';


export async function rewriteWithSTAR(input: BehavioralCoachInput): Promise<BehavioralCoachOutput> {
  return behavioralCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'behavioralCoachPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: BehavioralCoachInputSchema},
  output: {schema: BehavioralCoachOutputSchema},
  prompt: `You are an expert career coach specializing in behavioral interviews. Your task is to take a user's description of an experience and restructure it using the STAR (Situation, Task, Action, Result) method.

  {{#if question}}
  First, consider the interview question this story is for: "{{{question}}}"
  {{/if}}
  
  User's Experience:
  "{{{situation}}}"

  **Instructions:**
  1.  **Deconstruct into STAR:** Analyze the user's story and break it down into the four components of the STAR method. Infer any missing parts logically. For the 'Result', always try to add a quantifiable metric if possible (e.g., "increased efficiency by 15%," "reduced bug reports by 30%").
  2.  **Generate Three Answer Variations:** Based on the structured STAR components, craft three complete, compelling narrative answers:
      - **Formal Answer:** Professional, concise, and suitable for a traditional corporate interview.
      - **Conversational Answer:** More relaxed and story-like, suitable for startups or less formal company cultures.
      - **Leadership Answer:** Emphasizes initiative, ownership, and impact on the team or company. This version should highlight leadership qualities even if the user wasn't in a formal leadership role.

  Provide the complete response in the required JSON format.
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

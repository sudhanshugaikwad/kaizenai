
'use server';

/**
 * @fileOverview AI-powered behavioral interview coach.
 *
 * - rewriteWithSTAR - A function that rewrites a user's experience using the STAR method.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

export const BehavioralCoachInputSchema = z.object({
  situation: z.string().describe("The user's description of a situation or experience."),
  question: z.string().optional().describe("An optional interview question this experience is meant to answer (e.g., 'Tell me about a time you handled a conflict.')."),
});
export type BehavioralCoachInput = z.infer<typeof BehavioralCoachInputSchema>;

export const BehavioralCoachOutputSchema = z.object({
    starMethod: z.object({
        situation: z.string().describe("The situation or context of the story."),
        task: z.string().describe("The task or goal the user was trying to achieve."),
        action: z.string().describe("The specific actions the user took."),
        result: z.string().describe("The outcome or result of the user's actions, ideally with quantifiable metrics."),
    }).describe("The user's experience broken down into the STAR (Situation, Task, Action, Result) method."),
    formalAnswer: z.string().describe("A formally structured, professional version of the story suitable for a traditional corporate interview."),
    conversationalAnswer: z.string().describe("A more relaxed, conversational version of the story suitable for a less formal interview setting."),
    leadershipAnswer: z.string().describe("A version of the story that emphasizes leadership, initiative, and impact, suitable for senior or management roles."),
});
export type BehavioralCoachOutput = z.infer<typeof BehavioralCoachOutputSchema>;

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

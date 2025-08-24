'use server';

/**
 * @fileOverview An AI agent that coaches users on behavioral interview questions.
 *
 * - coachBehavioralAnswer - A function that rewrites user experiences into structured answers.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
  BehavioralCoachInputSchema,
  BehavioralCoachOutputSchema,
  type BehavioralCoachInput,
  type BehavioralCoachOutput,
} from './behavioral-coach.types';

export {type BehavioralCoachInput, type BehavioralCoachOutput};

export async function coachBehavioralAnswer(
  input: BehavioralCoachInput
): Promise<BehavioralCoachOutput> {
  return behavioralCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'behavioralCoachPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: BehavioralCoachInputSchema},
  output: {schema: BehavioralCoachOutputSchema},
  prompt: `You are an expert interview coach specializing in behavioral questions. Your task is to take a user's experience and rewrite it into multiple, well-structured formats using the STAR (Situation, Task, Action, Result) method.

  **User's Experience:**
  "{{{userExperience}}}"

  **Instructions:**
  1.  **Analyze the Experience:** Break down the user's input to identify the core situation, task, action, and result, even if they are not explicitly stated.
  2.  **Generate a Formal Answer:** Craft a professional, concise, and impactful answer suitable for a traditional corporate interview. This version should be clear and directly address the implicit question in the user's story.
  3.  **Generate a Conversational Answer:** Create a more relaxed, natural-sounding version that could be used in a less formal or startup-style interview. This version should still be professional but can use more personal language.
  4.  **Generate a Leadership-Focused Answer:** Rewrite the experience to highlight leadership qualities, such as initiative, problem-solving, team collaboration, or mentorship. This version should focus on the impact and influence the user had.
  5.  **Provide Key Takeaways:** Offer 2-3 bullet points of constructive feedback, suggesting what the user did well and how they could make their story even more powerful (e.g., "Quantify your results by mentioning specific numbers," or "Clearly state your role in the team's success.").

  Generate a response in the required JSON format. Ensure each answer variation is distinct and tailored to its purpose.
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

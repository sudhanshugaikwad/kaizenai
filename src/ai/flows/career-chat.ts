
'use server';

/**
 * @fileOverview An AI-powered career coach chat.
 *
 * - chatWithCoach - A function that handles the career chat interaction.
 * - CareerChatInput - The input type for the chatWithCoach function.
 * - CareerChatOutput - The return type for the chatWithCoach function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const CareerChatInputSchema = z.object({
  question: z.string().describe('The user\'s career-related question.'),
});
export type CareerChatInput = z.infer<typeof CareerChatInputSchema>;

const CareerChatOutputSchema = z.object({
  answer: z.string().describe('The AI career coach\'s answer to the question.'),
});
export type CareerChatOutput = z.infer<typeof CareerChatOutputSchema>;

export async function chatWithCoach(input: CareerChatInput): Promise<CareerChatOutput> {
  return careerChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerChatPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: CareerChatInputSchema},
  output: {schema: CareerChatOutputSchema},
  prompt: `You are Kaizen Ai, an expert career coach. Your role is to provide supportive, insightful, and actionable advice to users about their career questions.

  User's Question: {{{question}}}

  Your Answer:`,
});

const careerChatFlow = ai.defineFlow(
  {
    name: 'careerChatFlow',
    inputSchema: CareerChatInputSchema,
    outputSchema: CareerChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

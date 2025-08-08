
'use server';

/**
 * @fileOverview AI-powered task suggester.
 *
 * - suggestTaskContent - A function that generates task content based on a title.
 * - TaskSuggesterInput - The input type for the suggestTaskContent function.
 * - TaskSuggesterOutput - The return type for the suggestTaskContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSuggesterInputSchema = z.object({
  title: z.string().describe('The title of the task for which to generate content.'),
});
export type TaskSuggesterInput = z.infer<typeof TaskSuggesterInputSchema>;

const TaskSuggesterOutputSchema = z.object({
  content: z.string().describe('The generated content or sub-tasks for the given task title.'),
});
export type TaskSuggesterOutput = z.infer<typeof TaskSuggesterOutputSchema>;

export async function suggestTaskContent(input: TaskSuggesterInput): Promise<TaskSuggesterOutput> {
  return suggestTaskContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskSuggesterPrompt',
  input: {schema: TaskSuggesterInputSchema},
  output: {schema: TaskSuggesterOutputSchema},
  prompt: `You are a productivity assistant. Based on the provided task title, generate a brief, actionable description or a list of sub-tasks.

  Task Title: {{{title}}}

  Generated Content:`,
});

const suggestTaskContentFlow = ai.defineFlow(
  {
    name: 'suggestTaskContentFlow',
    inputSchema: TaskSuggesterInputSchema,
    outputSchema: TaskSuggesterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

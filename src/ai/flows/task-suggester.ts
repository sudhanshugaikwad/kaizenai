
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
  title: z.string().describe('The title or heading of the project/task for which to generate content.'),
});
export type TaskSuggesterInput = z.infer<typeof TaskSuggesterInputSchema>;

const TaskSuggesterOutputSchema = z.object({
  content: z.string().describe('The generated content, description, or sub-tasks for the given task title. This should be well-crafted and descriptive.'),
});
export type TaskSuggesterOutput = z.infer<typeof TaskSuggesterOutputSchema>;

export async function suggestTaskContent(input: TaskSuggesterInput): Promise<TaskSuggesterOutput> {
  return suggestTaskContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskSuggesterPrompt',
  input: {schema: TaskSuggesterInputSchema},
  output: {schema: TaskSuggesterOutputSchema},
  prompt: `You are a productivity assistant who is an expert at breaking down tasks. Based on the provided project or task heading, generate a well-crafted, descriptive text that can be used as the task's body. This could be a brief, actionable description or a list of sub-tasks.

  Task Heading: {{{title}}}

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

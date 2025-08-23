
'use server';

/**
 * @fileOverview AI-powered interview question bank.
 *
 * - fetchQuestionBank - A function that generates interview questions for a bank.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

export const QuestionBankInputSchema = z.object({
    role: z.string().describe('The job role to generate questions for (e.g., "Software Engineer").'),
    questionType: z.enum(['Technical', 'Behavioral', 'Situational']).describe('The type of questions to generate.'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the questions.'),
});
export type QuestionBankInput = z.infer<typeof QuestionBankInputSchema>;

export const QuestionBankOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe('The interview question.'),
    answer: z.string().describe('A detailed, ideal sample answer to the question.'),
  })).describe('A list of 15 interview questions with answers.'),
});
export type QuestionBankOutput = z.infer<typeof QuestionBankOutputSchema>;

export async function fetchQuestionBank(input: QuestionBankInput): Promise<QuestionBankOutput> {
  return fetchQuestionBankFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionBankPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: QuestionBankInputSchema},
  output: {schema: QuestionBankOutputSchema},
  prompt: `You are an expert career coach and interviewer. Your task is to generate a list of 15 high-quality interview questions based on the provided criteria. For each question, provide a detailed, ideal sample answer that a candidate could use as a reference.

  **Criteria:**
  - **Job Role:** {{{role}}}
  - **Question Type:** {{{questionType}}}
  - **Difficulty:** {{{difficulty}}}

  Generate questions that are relevant to the role, type, and difficulty specified. The answers should be comprehensive and demonstrate best practices.
  `,
});

const fetchQuestionBankFlow = ai.defineFlow(
  {
    name: 'fetchQuestionBankFlow',
    inputSchema: QuestionBankInputSchema,
    outputSchema: QuestionBankOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';

/**
 * @fileOverview AI-powered interview question bank.
 *
 * - fetchQuestionBank - A function that generates interview questions for a bank.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
    QuestionBankInputSchema,
    QuestionBankOutputSchema,
    type QuestionBankInput,
    type QuestionBankOutput,
} from './question-bank.types';

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

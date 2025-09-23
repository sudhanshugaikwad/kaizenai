
'use server';

/**
 * @fileOverview AI-powered interview question bank.
 *
 * - getQuestionsFromBank - A function that fetches interview questions.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    QuestionBankInputSchema,
    QuestionBankOutputSchema,
    type QuestionBankInput,
    type QuestionBankOutput,
} from './question-bank.types';

export async function getQuestionsFromBank(input: QuestionBankInput): Promise<QuestionBankOutput> {
  return questionBankFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionBankPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: QuestionBankInputSchema},
  output: {schema: QuestionBankOutputSchema},
  prompt: `You are an expert career coach and interviewer. Your task is to generate a list of 20 high-quality interview questions based on the provided criteria. For each question, provide a detailed, expert-level sample answer.

  **Question Criteria:**
  - **Job Role:** {{{jobRole}}}
  - **Question Type:** {{{questionType}}}
  - **Difficulty:** {{{difficulty}}}
  
  **Instructions:**
  1.  Generate **20 questions** that are highly relevant to the specified job role, question type, and difficulty level.
  2.  For each question, write a comprehensive **sample answer**. The answer should be detailed, well-structured, and demonstrate what an ideal candidate would say.
      - For technical questions, the answer should be accurate and include explanations of the concepts.
      - For behavioral questions, the answer should use a clear structure like the STAR method.
      - For situational questions, the answer should outline a logical approach to solving the problem.
  3.  Ensure the questions and answers are appropriate for the specified difficulty level (Beginner, Intermediate, or Advanced).

  Generate the response in the required JSON format.
  `,
});

const questionBankFlow = ai.defineFlow(
  {
    name: 'questionBankFlow',
    inputSchema: QuestionBankInputSchema,
    outputSchema: QuestionBankOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview AI-powered interview question bank.
 *
 * - getQuestionsFromBank - A function that retrieves interview questions.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
  QuestionBankInputSchema,
  QuestionBankOutputSchema,
  type QuestionBankInput,
  type QuestionBankOutput,
} from './question-bank.types';

export {type QuestionBankInput, type QuestionBankOutput};

export async function getQuestionsFromBank(
  input: QuestionBankInput
): Promise<QuestionBankOutput> {
  return questionBankFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionBankPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: QuestionBankInputSchema},
  output: {schema: QuestionBankOutputSchema},
  prompt: `You are an expert content creator for a career coaching platform. Your task is to generate a list of 20 high-quality interview questions based on the provided filters. For each question, provide a detailed, expert-level sample answer.

  **Question Criteria:**
  - **Role:** {{{role}}}
  - **Type:** {{{questionType}}}
  - **Difficulty:** {{{difficulty}}}

  **Instructions:**
  1.  Generate **20 questions** that precisely match the specified role, type, and difficulty level.
  2.  For each question, write a comprehensive **sample answer**.
      - For **technical questions**, the answer should be accurate, explain the concept clearly, and provide code examples where applicable.
      - For **behavioral questions**, the answer should follow the STAR method (Situation, Task, Action, Result) and demonstrate strong soft skills.
      - For **situational questions**, the answer should showcase problem-solving abilities and sound judgment.
  3.  Ensure the content is professional, insightful, and valuable for a candidate preparing for an interview.

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

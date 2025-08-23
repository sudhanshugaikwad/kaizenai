
/**
 * @fileOverview Type definitions for the interview question bank flow.
 */
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

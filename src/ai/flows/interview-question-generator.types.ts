/**
 * @fileOverview Type definitions for the interview question generator flow.
 */
import {z} from 'genkit';

export const InterviewQuestionsInputSchema = z.object({
  role: z.string().describe('The job role for the interview (e.g., "Software Engineer").'),
  roundType: z.enum(['Coding', 'Beginner', 'Role Related', 'Fresher']).describe('The type of interview round.'),
  language: z.string().optional().describe('The programming language for a coding round.'),
  resumeDataUri: z.string().optional().describe(
      "A resume file, as a data URI, to tailor questions. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type InterviewQuestionsInput = z.infer<typeof InterviewQuestionsInputSchema>;

export const InterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe('The interview question.'),
    options: z.array(z.string()).length(4).describe('An array of 4 multiple-choice options.'),
    correctAnswer: z.string().describe('The correct answer from the options array.'),
  })).length(40).describe('A list of 40 multiple-choice interview questions.'),
});
export type InterviewQuestionsOutput = z.infer<typeof InterviewQuestionsOutputSchema>;

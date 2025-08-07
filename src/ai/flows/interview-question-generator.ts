
'use server';

/**
 * @fileOverview AI-powered interview question generator.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - InterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - InterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
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
    answer: z.string().describe('A brief, ideal answer or key points to cover for the question.'),
  })).describe('A list of 5-10 interview questions with answers.'),
});
export type InterviewQuestionsOutput = z.infer<typeof InterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: InterviewQuestionsInput): Promise<InterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionPrompt',
  input: {schema: InterviewQuestionsInputSchema},
  output: {schema: InterviewQuestionsOutputSchema},
  prompt: `You are an expert interviewer and career coach. Your task is to generate a list of 5-10 relevant interview questions based on the provided details. For each question, provide a sample answer or key points.

  **Interview Details:**
  - **Job Role:** {{{role}}}
  - **Interview Round:** {{{roundType}}}
  {{#if language}}- **Programming Language:** {{{language}}}{{/if}}
  
  {{#if resumeDataUri}}
  - **Resume Analysis:** Analyze the following resume to ask personalized questions that align with the candidate's experience and skills.
    Resume: {{media url=resumeDataUri}}
  {{/if}}

  Generate questions that are appropriate for the specified round type and job role. For "Coding" rounds, the questions should be language-specific if a language is provided.
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: InterviewQuestionsInputSchema,
    outputSchema: InterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

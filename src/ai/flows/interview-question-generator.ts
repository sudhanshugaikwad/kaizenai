
'use server';

/**
 * @fileOverview AI-powered interview question generator.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 */

import {ai} from '@/ai/genkit';
import {
  InterviewQuestionsInputSchema,
  InterviewQuestionsOutputSchema,
  type InterviewQuestionsInput,
  type InterviewQuestionsOutput,
} from './interview-question-generator.types';


export async function generateInterviewQuestions(input: InterviewQuestionsInput): Promise<InterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionPrompt',
  input: {schema: InterviewQuestionsInputSchema},
  output: {schema: InterviewQuestionsOutputSchema},
  prompt: `You are an expert interviewer and career coach. Your task is to generate a list of 20-30 multiple-choice questions (MCQs) based on the provided details. For each question, provide 4 distinct options and clearly indicate the correct answer.

  **Interview Details:**
  - **Job Role:** {{{role}}}
  - **Interview Round:** {{{roundType}}}
  {{#if language}}- **Programming Language:** {{{language}}}{{/if}}
  
  {{#if resumeDataUri}}
  - **Resume Analysis:** Analyze the following resume to ask personalized questions that align with the candidate's experience and skills.
    Resume: {{media url=resumeDataUri}}
  {{/if}}

  Generate MCQs that are appropriate for the specified round type and job role. For "Coding" rounds, the questions should be language-specific if a language is provided.
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

    

'use server';

/**
 * @fileOverview An AI agent that analyzes and optimizes resumes.
 *
 * - optimizeResume - A function that handles the resume optimization process.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
    ResumeOptimizerInputSchema,
    ResumeOptimizerOutputSchema,
    type ResumeOptimizerInput,
    type ResumeOptimizerOutput,
} from './resume-optimizer.types';

export { type ResumeOptimizerInput, type ResumeOptimizerOutput };


export async function optimizeResume(input: ResumeOptimizerInput): Promise<ResumeOptimizerOutput> {
  return resumeOptimizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeOptimizerPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: ResumeOptimizerInputSchema},
  output: {schema: ResumeOptimizerOutputSchema},
  prompt: `You are an expert resume optimizer and career coach. Your task is to analyze the provided resume and job description to provide a comprehensive set of improvements.

  **Resume Analysis:**
  - Analyze the following resume: {{media url=resumeDataUri}}
  {{#if jobDescription}}
  - **Job Description:** {{{jobDescription}}}
  {{/if}}

  **Instructions:**
  1.  **ATS Keyword Matching:**
      - Compare the resume against the job description (if provided).
      - Identify relevant keywords that are present in the job description but missing from the resume.
      - Suggest specific keywords to add to the resume to improve its ATS score.

  2.  **Formatting Suggestions:**
      - Analyze the resume's layout, structure, and readability.
      - Provide actionable suggestions to improve formatting (e.g., "Use bullet points for job responsibilities," "Ensure consistent font usage," "Keep the resume to one page if you have less than 10 years of experience").

  3.  **Content Improvements:**
      - Review the language and phrasing used in the resume.
      - Suggest using stronger action verbs to describe accomplishments.
      - Recommend quantifying achievements with numbers and metrics wherever possible (e.g., "Increased sales by 20%" instead of "Responsible for sales").
      - Provide examples of how to rephrase sentences for greater impact.
      - Parse the main sections of the resume (summary, experience, education, skills) and provide structured content that the user can copy.

  **IMPORTANT**: If the resume file is invalid or cannot be read, return empty arrays for all suggestion fields and a summary indicating the issue. Do not throw an error.
  `,
});

const resumeOptimizerFlow = ai.defineFlow(
  {
    name: 'resumeOptimizerFlow',
    inputSchema: ResumeOptimizerInputSchema,
    outputSchema: ResumeOptimizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// src/ai/flows/resume-analyzer.ts
'use server';
/**
 * @fileOverview A resume analysis AI agent.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z.string().optional().describe('The job description to compare the resume against.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  overallScore: z.number().describe('An overall score for the resume, from 0 to 100.'),
  summary: z.string().describe('A brief summary of the resume analysis.'),
  improvements: z
    .array(
      z.object({
        section: z.string().describe('The section of the resume to improve (e.g., "Experience", "Skills").'),
        suggestion: z.string().describe('The specific suggestion for improvement.'),
      })
    )
    .describe('A list of suggestions for improving the resume.'),
  atsKeywords: z.object({
    matchingKeywords: z.array(z.string()).describe('Keywords from the job description found in the resume.'),
    missingKeywords: z.array(z.string()).describe('Keywords from the job description missing from the resume.'),
  }).describe('An analysis of keywords for Applicant Tracking Systems (ATS).'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;


export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are a world-class resume expert and career coach. You will analyze the provided resume and provide a comprehensive evaluation. If a job description is provided, you must compare the resume against it.

  Your analysis must include:
  1.  An **Overall Score** from 0 to 100, representing the resume's quality, clarity, and relevance to the job description (if provided).
  2.  A concise **Summary** of the resume's strengths and weaknesses.
  3.  A list of actionable **Improvements**, categorized by resume section (e.g., Summary, Experience, Skills, Education).
  4.  An **ATS Keyword Analysis** that identifies matching and missing keywords based on the job description. If no job description is provided, this section should be based on general best practices for the inferred role.

  **IMPORTANT**: If the provided resume file cannot be processed, is empty, or seems invalid, you MUST set the 'overallScore' to 0, the 'summary' to 'Could not process the provided resume. Please ensure it is a valid and readable file.', and return empty arrays for 'improvements' and 'atsKeywords'. Do not throw an error.

  Resume: {{media url=resumeDataUri}}

  {{#if jobDescription}}
  Job Description: {{{jobDescription}}}
  {{/if}}`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

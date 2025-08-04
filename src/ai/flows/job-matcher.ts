'use server';

/**
 * @fileOverview An AI agent that matches job roles based on a resume.
 *
 * - matchJobs - A function that handles the job matching process.
 * - JobMatcherInput - The input type for the matchJobs function.
 * - JobMatcherOutput - The return type for the matchJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobMatcherInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type JobMatcherInput = z.infer<typeof JobMatcherInputSchema>;

const JobMatcherOutputSchema = z.object({
  matchedJobs: z.array(
    z.object({
      jobTitle: z.string().describe('The title of the job.'),
      companyName: z.string().describe('The name of the company.'),
      jobDescription: z.string().describe('A brief description of the job role and responsibilities.'),
      applyLink: z.string().describe('A direct URL to the job application page (e.g., LinkedIn, company website).'),
    })
  ).describe('A list of 5-10 job roles that are a good match for the resume.'),
});
export type JobMatcherOutput = z.infer<typeof JobMatcherOutputSchema>;


export async function matchJobs(input: JobMatcherInput): Promise<JobMatcherOutput> {
  return jobMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatcherPrompt',
  input: {schema: JobMatcherInputSchema},
  output: {schema: JobMatcherOutputSchema},
  prompt: `You are an expert career consultant and recruiter. Your task is to analyze the provided resume and find 5-10 suitable, currently open job roles for the candidate.

  For each job you find, you must provide:
  1.  A clear **Job Title**.
  2.  The **Company Name**.
  3.  A brief **Job Description** summarizing the key responsibilities.
  4.  A direct **Apply Link**. You must find real, active job posting URLs from sources like LinkedIn, Naukri, or official company career pages.

  Analyze the resume thoroughly to understand the candidate's skills, experience, and career trajectory to find the best possible matches.

  Resume: {{media url=resumeDataUri}}
  `,
});

const jobMatcherFlow = ai.defineFlow(
  {
    name: 'jobMatcherFlow',
    inputSchema: JobMatcherInputSchema,
    outputSchema: JobMatcherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

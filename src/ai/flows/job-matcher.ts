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
  userJobRole: z.string().describe("The user's most likely job role based on the resume analysis. If the resume is empty or cannot be read, state that it could not be processed."),
  matchedJobs: z.array(
    z.object({
      jobTitle: z.string().describe('The title of the job or internship.'),
      companyName: z.string().describe('The name of the company.'),
      jobDescription: z.string().describe('A brief description of the job role and responsibilities.'),
      location: z.string().describe('The location of the job (e.g., "Pune", "Mumbai", "Hyderabad", "Bangalore").'),
      applyLink: z.string().describe('A direct URL to the job application page (e.g., LinkedIn, Naukri, company website).'),
      postedDate: z.string().describe('How long ago the job was posted (e.g., "5 days ago", "2 weeks ago").')
    })
  ).describe('A list of 5-10 job roles and internships that are a good match for the resume, prioritizing recent postings. If the resume is empty or cannot be read, return an empty array.'),
});
export type JobMatcherOutput = z.infer<typeof JobMatcherOutputSchema>;


export async function matchJobs(input: JobMatcherInput): Promise<JobMatcherOutput> {
  return jobMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatcherPrompt',
  input: {schema: JobMatcherInputSchema},
  output: {schema: JobMatcherOutputSchema},
  prompt: `You are an expert career consultant and recruiter specializing in the Indian job market. Your task is to:

  1.  Analyze the provided resume to determine the candidate's most likely **Job Role**.
  2.  Find 5-10 suitable, currently open job roles **and internships** for the candidate **in India**, prioritizing major cities like Pune, Mumbai, Hyderabad, and Bangalore.
  3.  **Prioritize recently published jobs**, ideally those posted within the last 2, 5, or 10 days.

  For each job or internship you find, you must provide:
  1.  A clear **Job Title**.
  2.  The **Company Name**.
  3.  A brief **Job Description** summarizing the key responsibilities.
  4.  The **Location** of the job (City, State).
  5.  A direct **Apply Link**. You must find real, active job posting URLs from sources like LinkedIn, Naukri, or official company career pages.
  6.  The **Posted Date** indicating how recently the position was advertised (e.g., "2 days ago", "1 week ago").

  Analyze the resume thoroughly to understand the candidate's skills, experience, and career trajectory to find the best possible matches.

  **IMPORTANT**: If the provided resume file cannot be processed, is empty, or seems invalid, you MUST set the 'userJobRole' field to 'Could not process resume' and return an empty array for 'matchedJobs'. Do not throw an error.

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


'use server';

/**
 * @fileOverview An AI agent that provides smart job recommendations.
 *
 * - recommendJobs - A function that handles the job recommendation process.
 * - SmartJobRecommenderInput - The input type for the recommendJobs function.
 * - SmartJobRecommenderOutput - The return type for the recommendJobs function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const SmartJobRecommenderInputSchema = z.object({
  jobPreferences: z.object({
    roles: z.array(z.string()).describe('A list of desired job roles.'),
    locations: z.array(z.string()).describe('A list of preferred locations (including "Remote").'),
    jobTypes: z.array(z.enum(["Full-time", "Part-time", "Internship", "Contract"])).describe('Preferred job types.'),
    experienceLevel: z.string().describe('The user\'s experience level (e.g., "Entry-level", "2-4 years", "Senior").'),
  }).describe('The user\'s job preferences.'),
  resumeDataUri: z.string().optional().describe(
    "An optional resume file, as a data URI, for more accurate recommendations. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type SmartJobRecommenderInput = z.infer<typeof SmartJobRecommenderInputSchema>;

const SmartJobRecommenderOutputSchema = z.object({
  recommendedJobs: z.array(
    z.object({
      jobTitle: z.string().describe('The title of the job.'),
      companyName: z.string().describe('The name of the company.'),
      location: z.string().describe('The location of the job.'),
      salaryRange: z.string().describe('An estimated or provided salary range for the role (e.g., "$80,000 - $120,000", "Not Disclosed").'),
      matchScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how well the job matches the user\'s profile and preferences.'),
      jobDescription: z.string().describe('A brief summary of the job responsibilities and requirements.'),
      applyLink: z.string().url().describe('A direct URL to the job application page.'),
    })
  ).describe('A list of 10-15 recommended jobs tailored to the user.'),
});
export type SmartJobRecommenderOutput = z.infer<typeof SmartJobRecommenderOutputSchema>;


export async function recommendJobs(input: SmartJobRecommenderInput): Promise<SmartJobRecommenderOutput> {
  return smartJobRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartJobRecommenderPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: SmartJobRecommenderInputSchema},
  output: {schema: SmartJobRecommenderOutputSchema},
  prompt: `You are an expert career consultant and AI-powered job recommender. Your task is to analyze the user's profile and preferences to find highly relevant job openings.

  **User Preferences:**
  - **Desired Roles:** {{{jobPreferences.roles}}}
  - **Preferred Locations:** {{{jobPreferences.locations}}}
  - **Job Types:** {{{jobPreferences.jobTypes}}}
  - **Experience Level:** {{{jobPreferences.experienceLevel}}}

  {{#if resumeDataUri}}
  - **User Resume:** Analyze the following resume for skills and experience to improve recommendation accuracy.
    Resume: {{media url=resumeDataUri}}
  {{/if}}

  **Instructions:**
  1.  Find **10-15 currently open job roles** that are an excellent match for the user's preferences and resume (if provided).
  2.  For each job, calculate a **Match Score** (0-100) representing the alignment between the job requirements and the user's profile.
  3.  Provide an estimated **Salary Range**. If the actual salary is not listed, provide a realistic market-rate estimate based on the role, location, and experience level.
  4.  Provide all other required fields: Job Title, Company Name, Location, a brief Job Description, and a direct Apply Link from a reputable source (e.g., LinkedIn, company career page).

  **IMPORTANT**: Prioritize recent job postings. Find real, active jobs.
  `,
});

const smartJobRecommenderFlow = ai.defineFlow(
  {
    name: 'smartJobRecommenderFlow',
    inputSchema: SmartJobRecommenderInputSchema,
    outputSchema: SmartJobRecommenderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

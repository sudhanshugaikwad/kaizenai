
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
    roles: z.array(z.string()).describe('A list of desired job roles or skills.'),
    jobTypes: z.array(z.enum(["Full-time", "Part-time", "Internship", "Contract"])).describe('Preferred job types.'),
    experienceLevel: z.string().describe('The user\'s experience level (e.g., "Entry-level", "2-4 years", "Senior", "Any").'),
    country: z.string().optional().describe('The preferred country for the job search.'),
    city: z.string().optional().describe('The preferred city for the job search.'),
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
      location: z.string().describe('The location of the job (City, Country).'),
      salaryRange: z.string().describe('An estimated or provided salary range for the role (e.g., "$80,000 - $120,000", "₹12,00,000 - ₹18,00,000", "Not Disclosed").'),
      matchScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how well the job matches the user\'s profile and preferences.'),
      jobDescription: z.string().describe('A brief summary of the job responsibilities and requirements.'),
      postedDate: z.string().describe('How long ago the job was posted (e.g., "5 days ago", "2 weeks ago", "Posted today").'),
      applyLink: z.string().url().describe('A direct URL to the job application page from a reputable source like LinkedIn, Naukri, or an official company career site.'),
    })
  ).describe('A list of 20-25 recommended jobs tailored to the user from across the globe.'),
});
export type SmartJobRecommenderOutput = z.infer<typeof SmartJobRecommenderOutputSchema>;


export async function recommendJobs(input: SmartJobRecommenderInput): Promise<SmartJobRecommenderOutput> {
  return smartJobRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartJobRecommenderPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: SmartJobRecommenderInputSchema},
  output: {schema: SmartJobRecommenderOutputSchema},
  prompt: `You are an expert global career consultant and AI-powered job recommender. Your task is to analyze the user's profile and preferences to find highly relevant job openings worldwide, across any professional field (e.g., IT, Finance, Marketing, Healthcare).

  **User Preferences:**
  - **Desired Roles/Skills:** {{#each jobPreferences.roles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Job Types:** {{#each jobPreferences.jobTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Experience Level:** {{{jobPreferences.experienceLevel}}}
  {{#if jobPreferences.country}}- **Country:** {{{jobPreferences.country}}}{{/if}}
  {{#if jobPreferences.city}}- **City:** {{{jobPreferences.city}}}{{/if}}

  {{#if resumeDataUri}}
  - **User Resume:** Analyze the following resume for skills and experience to improve recommendation accuracy.
    Resume: {{media url=resumeDataUri}}
  {{/if}}

  **Instructions:**
  1.  Find **20 to 25 currently open job roles** that are an excellent match for the user's selected roles/skills and preferences. The search must be **global** unless a specific country or city is provided.
  2.  Aggregate these jobs from reputable sources like **LinkedIn, Naukri, and official company career pages**.
  3.  For each job, calculate a **Match Score** (0-100) representing the alignment between the job requirements and the user's profile.
  4.  Provide an estimated **Salary Range**. If the actual salary is not listed, provide a realistic market-rate estimate based on the role, location, and experience level, in the local currency.
  5.  Provide the **Posted Date**, indicating how recently the job was advertised (e.g., "Posted 2 days ago", "1 week ago").
  6.  Provide all other required fields: Job Title, Company Name, Location (City, Country), a brief Job Description, and a direct Apply Link.

  **IMPORTANT**: Prioritize recent job postings. Find real, active jobs. If no jobs are found matching the criteria, return an empty array for 'recommendedJobs'. Do not throw an error.
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

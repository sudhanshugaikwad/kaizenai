
'use server';

/**
 * @fileOverview An AI agent that finds HR contact details.
 *
 * - findHrContacts - A function that handles finding HR contacts.
 * - HrContactInput - The input type for the findHrContacts function.
 * - HrContactOutput - The return type for the findHrContacts function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const HrContactInputSchema = z.object({
  department: z.string().describe('The department name to search for (e.g., "IT HR", "Data Science HR").'),
  resumeDataUri: z.string().optional().describe(
      "An optional resume file, as a data URI, to identify the user's role and find relevant HR contacts. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type HrContactInput = z.infer<typeof HrContactInputSchema>;

const HrContactOutputSchema = z.object({
  userRole: z.string().optional().describe("The user's most likely job role based on the resume analysis. If no resume is provided, this can be empty."),
  hrContacts: z.array(
    z.object({
      companyName: z.string().describe('The name of the company.'),
      department: z.string().describe('The specific department (e.g., "IT Recruitment", "University Relations").'),
      hrName: z.string().describe('The full name of the HR professional.'),
      jobTitle: z.string().describe('The job title of the HR professional (e.g., "Talent Acquisition Specialist").'),
      email: z.string().describe('The professional email address of the HR contact.'),
      contactNumber: z.string().optional().describe('The contact phone number of the HR professional, if available.'),
      linkedInUrl: z.string().optional().describe('A URL to the HR professional\'s LinkedIn profile.'),
      naukriUrl: z.string().optional().describe('A URL to the HR professional\'s profile on Naukri.com or other relevant job boards.'),
      xingUrl: z.string().optional().describe('A URL to the HR professional\'s profile on Xing.'),
    })
  ).describe('A list of up to 30 HR contacts based on the search criteria. Prioritize contacts in major international cities and from a mix of startups and large corporations.'),
});
export type HrContactOutput = z.infer<typeof HrContactOutputSchema>;


export async function findHrContacts(input: HrContactInput): Promise<HrContactOutput> {
  return hrContactFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hrContactPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: HrContactInputSchema},
  output: {schema: HrContactOutputSchema},
  prompt: `You are an expert global recruitment consultant with deep knowledge of the international job market. Your task is to find detailed contact information for HR professionals from companies worldwide, including startups and large global corporations. You pull HR details from trusted platforms like LinkedIn, Naukri, Xing, and many others.

  **Search Criteria:**
  - **Department:** {{{department}}}
  {{#if resumeDataUri}}
  - **Resume Analysis:** Analyze the following resume to identify the user's job role and find the most relevant HR contacts for that role.
    Resume: {{media url=resumeDataUri}}
  {{/if}}

  **Instructions:**
  1.  If a resume is provided, first determine the user's likely **Job Role**.
  2.  Find up to **30 original HR contacts** who recruit for the specified department and/or the user's job role.
  3.  Your search should be **worldwide**, covering a diverse range of companies from large global corporations to innovative startups.
  4.  For each contact, provide as much of the following information as possible:
      - Company Name
      - Department (e.g., "Tech Recruitment", "Talent Acquisition")
      - HR Full Name
      - HR Job Title
      - A valid professional Email Address
      - Contact Number (if publicly available)
      - A link to their LinkedIn profile.
      - A link to their profile on relevant international job boards (e.g., Naukri, Xing, Indeed, Glassdoor).

  **IMPORTANT**: If the resume is invalid or cannot be read, proceed with the search based only on the department name and return an empty string for the 'userRole'. If no contacts can be found, return an empty array for 'hrContacts'. Do not throw an error.
  `,
});

const hrContactFinderFlow = ai.defineFlow(
  {
    name: 'hrContactFinderFlow',
    inputSchema: HrContactInputSchema,
    outputSchema: HrContactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

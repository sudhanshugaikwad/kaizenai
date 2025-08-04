'use server';

/**
 * @fileOverview AI-powered cover letter generator.
 *
 * - generateCoverLetter - A function that generates a cover letter.
 * - CoverLetterInput - The input type for the generateCoverLetter function.
 * - CoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoverLetterInputSchema = z.object({
  jobTitle: z.string().describe('The job title for which the cover letter is being written.'),
  companyName: z.string().describe('The name of the company to which the cover letter is addressed.'),
  jobDescription: z.string().describe('A detailed description of the job, including responsibilities and requirements.'),
  skills: z.string().describe('A list of relevant skills that align with the job requirements.'),
  experience: z.string().describe('A summary of relevant work experience.'),
});
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;

const CoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});
export type CoverLetterOutput = z.infer<typeof CoverLetterOutputSchema>;

export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterPrompt',
  input: {schema: CoverLetterInputSchema},
  output: {schema: CoverLetterOutputSchema},
  prompt: `You are an expert career coach specializing in crafting compelling cover letters.

  Based on the information provided, generate a personalized cover letter that highlights the candidate's qualifications and enthusiasm for the position.

  Job Title: {{{jobTitle}}}
  Company Name: {{{companyName}}}
  Job Description: {{{jobDescription}}}
  Skills: {{{skills}}}
  Experience: {{{experience}}}

  Cover Letter:`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

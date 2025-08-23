
/**
 * @fileOverview Type definitions for the resume optimizer AI flow.
 */
import {z} from 'genkit';

export const ResumeOptimizerInputSchema = z.object({
  resumeDataUri: z.string().describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  jobDescription: z.string().optional().describe('The job description to compare the resume against.'),
});
export type ResumeOptimizerInput = z.infer<typeof ResumeOptimizerInputSchema>;

export const ResumeContentSchema = z.object({
    summary: z.string().optional(),
    experience: z.array(z.object({
        role: z.string(),
        company: z.string(),
        duration: z.string(),
        description: z.array(z.string()),
    })).optional(),
    education: z.array(z.object({
        degree: z.string(),
        institution: z.string(),
        duration: z.string(),
    })).optional(),
    skills: z.array(z.string()).optional(),
});

export const ResumeOptimizerOutputSchema = z.object({
    atsKeywords: z.object({
        matchingKeywords: z.array(z.string()).describe('Keywords from the job description found in the resume.'),
        missingKeywords: z.array(z.string()).describe('Keywords from the job description missing from the resume.'),
    }).describe("An analysis of keywords for Applicant Tracking Systems (ATS)."),
    formattingSuggestions: z.array(z.string()).describe("A list of actionable suggestions to improve the resume's layout and formatting."),
    contentImprovements: z.array(z.object({
        section: z.string().describe("The section of the resume to improve (e.g., 'Experience', 'Skills')."),
        suggestion: z.string().describe("The specific suggestion for improvement."),
    })).describe("A list of actionable improvements for the resume's content."),
    optimizedContent: ResumeContentSchema.describe("The fully parsed and optimized content of the resume, structured for easy editing and rendering in a template."),
});
export type ResumeOptimizerOutput = z.infer<typeof ResumeOptimizerOutputSchema>;

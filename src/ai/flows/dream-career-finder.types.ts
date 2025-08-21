
/**
 * @fileOverview Type definitions for the dream career finder AI flow.
 */
import {z} from 'genkit';

export const DreamCareerFinderInputSchema = z.object({
  userCategory: z.enum(['Student', 'Job Seeker', 'Professional', 'Other']).describe('The category the user identifies with.'),
  educationLevel: z.string().optional().describe("For students: their current education level (e.g., 'High School', 'Bachelors')."),
  interests: z.string().optional().describe("The user's interests (e.g., 'Technology, Arts')."),
  strengths: z.string().optional().describe("The user's self-identified strengths (e.g., 'Problem Solving, Communication')."),
  workStyle: z.string().optional().describe("The user's preferred work style (e.g., 'In a team')."),
  motivation: z.string().optional().describe("What motivates the user in their career (e.g., 'Making an Impact')."),
  currentRole: z.string().optional().describe("For Job Seekers/Professionals: their current or most recent job title."),
  yearsOfExperience: z.string().optional().describe("For Job Seekers/Professionals: their years of professional experience."),
});
export type DreamCareerFinderInput = z.infer<typeof DreamCareerFinderInputSchema>;

export const DreamCareerFinderOutputSchema = z.object({
    careerTitle: z.string().describe("The primary suggested career title. e.g., 'Software Developer'"),
    careerIcon: z.string().emoji().describe("A single emoji that represents the primary career. e.g., '💻'"),
    whyThisFits: z.string().describe("A concise explanation of why this career is a good fit for the user based on their answers."),
    recommendedCourses: z.array(z.string()).optional().describe("A list of 2-3 recommended degrees or courses."),
    suggestedPaths: z.array(z.string()).describe("A list of 2-3 specific career paths to explore."),
    nextSteps: z.array(z.string()).describe("A list of 3 actionable next steps for the user to pursue this career path."),
    careerInsights: z.string().describe("An additional useful insight or tip about the recommended career field."),
});
export type DreamCareerFinderOutput = z.infer<typeof DreamCareerFinderOutputSchema>;

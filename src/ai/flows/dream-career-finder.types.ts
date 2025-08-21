
/**
 * @fileOverview Type definitions for the dream career finder AI flow.
 */
import {z} from 'genkit';

export const DreamCareerFinderInputSchema = z.object({
  strength: z.string().describe("The user's answer to 'What do you enjoy the most?'. e.g., 'Problem Solving'"),
  workStyle: z.string().describe("The user's answer to 'Do you prefer working alone, in a team, or a mix of both?'. e.g., 'In a team'"),
  interests: z.string().describe("The user's answer to 'Which subjects or fields excite you the most?'. e.g., 'Technology'"),
  motivation: z.string().describe("The user's answer to 'What motivates you the most in your career?'. e.g., 'Making an Impact'"),
  workSetting: z.string().describe("The user's answer to 'What kind of work setting do you prefer?'. e.g., 'Office Work'"),
});
export type DreamCareerFinderInput = z.infer<typeof DreamCareerFinderInputSchema>;

export const DreamCareerFinderOutputSchema = z.object({
    careerTitle: z.string().describe("The suggested career title. e.g., 'Software Developer'"),
    careerIcon: z.string().emoji().describe("A single emoji that represents the career. e.g., '💻'"),
    whyThisFits: z.string().describe("A concise explanation of why this career is a good fit for the user based on their answers."),
    nextSteps: z.array(z.string()).describe("A list of 3 actionable next steps for the user to pursue this career path."),
});
export type DreamCareerFinderOutput = z.infer<typeof DreamCareerFinderOutputSchema>;

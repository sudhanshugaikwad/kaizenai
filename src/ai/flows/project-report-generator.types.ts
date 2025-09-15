
/**
 * @fileOverview Type definitions for the project report generator AI flow.
 */
import {z} from 'genkit';

export const ProjectReportInputSchema = z.object({
    projectTitle: z.string().describe("The title of the project."),
    technologiesUsed: z.array(z.string()).describe("A list of technologies, languages, or frameworks used."),
    teamMembers: z.array(z.object({
        name: z.string(),
        role: z.string(),
    })).describe("An array of team members with their names and roles."),
    guideName: z.string().describe("The name of the project guide or mentor."),
    collegeName: z.string().describe("The name of the college or university."),
});
export type ProjectReportInput = z.infer<typeof ProjectReportInputSchema>;

export const ProjectReportOutputSchema = z.object({
    acknowledgement: z.string().describe("A generated acknowledgement section for the report, thanking the guide, college, and team members."),
    abstract: z.string().describe("A generated abstract that provides a concise summary of the project, its objectives, and outcomes."),
    conclusion: z.string().describe("A generated conclusion and future scope section, summarizing the project's findings and suggesting potential future work."),
});
export type ProjectReportOutput = z.infer<typeof ProjectReportOutputSchema>;

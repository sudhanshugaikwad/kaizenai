
'use server';

/**
 * @fileOverview An AI agent that generates a complete project report.
 *
 * - generateProjectReport - A function that handles the report generation.
 * - ProjectReportInput - The input type for the function.
 * - ProjectReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
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

export async function generateProjectReport(input: ProjectReportInput): Promise<ProjectReportOutput> {
  return projectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectReportGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: ProjectReportInputSchema},
  output: {schema: ProjectReportOutputSchema},
  prompt: `You are an expert academic writer specializing in creating final year project reports. Your task is to generate the Acknowledgement, Abstract, and Conclusion/Future Scope sections for a project report based on the provided details.

  **Project Details:**
  - **Title:** {{{projectTitle}}}
  - **Technologies:** {{#each technologiesUsed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **College:** {{{collegeName}}}
  - **Project Guide:** {{{guideName}}}
  - **Team Members:** 
    {{#each teamMembers}}
    - {{{name}}} ({{{role}}})
    {{/each}}

  **Instructions:**
  1.  **Generate Acknowledgement:** Write a heartfelt acknowledgement. Thank the project guide, '{{{guideName}}}', and the institution, '{{{collegeName}}}'. Also, acknowledge the collaborative effort of the team members.
  2.  **Generate Abstract:** Create a concise and professional abstract. It should briefly introduce the project, state the main objectives, mention the key technologies used ({{#each technologiesUsed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}), and summarize the outcome.
  3.  **Generate Conclusion & Future Scope:** Write a conclusion that summarizes the project's achievements and learnings. Then, suggest 2-3 realistic ideas for 'Future Scope,' outlining how the project could be expanded or improved.

  Provide the output in the required JSON format.
  `,
});

const projectReportFlow = ai.defineFlow(
  {
    name: 'projectReportFlow',
    inputSchema: ProjectReportInputSchema,
    outputSchema: ProjectReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

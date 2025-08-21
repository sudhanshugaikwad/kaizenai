/**
 * @fileOverview Type definitions for the project idea generator AI flow.
 */
import {z} from 'genkit';

export const ProjectIdeaInputSchema = z.object({
  frontendLanguages: z.array(z.string()).describe('A list of selected frontend programming languages or frameworks.'),
  backendLanguages: z.array(z.string()).describe('A list of selected backend programming languages or frameworks.'),
  experienceLevel: z.enum(['Student/Fresher', '1-2 years experience']).describe('The user\'s experience level.'),
});
export type ProjectIdeaInput = z.infer<typeof ProjectIdeaInputSchema>;

const RoadmapStepSchema = z.object({
    title: z.string().describe('The title of the roadmap step.'),
    details: z.array(z.string()).describe('A list of sub-steps or details for this step.'),
    resources: z.array(z.object({
        name: z.string().describe('The name of the resource.'),
        url: z.string().url().describe('The URL for the resource.'),
    })).optional().describe('A list of helpful resources for this step.'),
});

const ProjectTreeSchema = z.object({
    validation: RoadmapStepSchema.describe('Step 1: Validate the project idea.'),
    setup: RoadmapStepSchema.describe('Step 2: Project setup, installation, and file structure.'),
    breakdown: RoadmapStepSchema.describe('Step 3: Section-wise breakdown of features to build.'),
    deployment: RoadmapStepSchema.describe('Step 4: Testing and deployment options.'),
});

export const ProjectIdeaOutputSchema = z.object({
    projectTitle: z.string().describe('A clear and descriptive title for the project idea.'),
    projectDescription: z.string().describe('A brief, one-paragraph description of the project.'),
    techStack: z.array(z.string()).describe('The recommended tech stack for the project.'),
    complexity: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The complexity level of the project.'),
    duration: z.object({
        student: z.string().describe('Estimated duration for a student or fresher.'),
        experienced: z.string().describe('Estimated duration for a developer with 1-2 years of experience.'),
    }).describe('Estimated project duration based on experience level.'),
    projectTree: ProjectTreeSchema.describe('A structured, step-by-step roadmap for the project.'),
});

export type ProjectIdeaOutput = z.infer<typeof ProjectIdeaOutputSchema>;

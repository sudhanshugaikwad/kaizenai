/**
 * @fileOverview Type definitions for the agent roadmap generator AI flow.
 */
import {z} from 'genkit';

export const AgentRoadmapInputSchema = z.object({
    agentName: z.string().describe("The name of the AI agent."),
    agentType: z.string().describe("The type or category of the AI agent."),
    platformName: z.string().describe("The target platform (e.g., n8n, Make.com)."),
    description: z.string().optional().describe("A user-provided description of the agent's function."),
});
export type AgentRoadmapInput = z.infer<typeof AgentRoadmapInputSchema>;

export const AgentRoadmapOutputSchema = z.object({
    summary: z.string().describe("A brief summary of the generated roadmap and the agent's purpose."),
    workflowSteps: z.array(z.object({
        id: z.string().describe("A unique identifier for the step (e.g., 'step1')."),
        title: z.string().describe("The title of the workflow step."),
        description: z.string().describe("A brief description of what this step involves."),
    })).describe("A list of structured steps to build the agent workflow."),
    jsonOutput: z.string().describe("A JSON string representing the workflow, formatted for the specified platform (e.g., n8n)."),
    resourcesAndTips: z.array(z.object({
        title: z.string().describe("The title of the resource or tip."),
        content: z.string().describe("The detailed content of the resource or tip."),
    })).describe("A list of helpful resources, tips, and best practices."),
});
export type AgentRoadmapOutput = z.infer<typeof AgentRoadmapOutputSchema>;

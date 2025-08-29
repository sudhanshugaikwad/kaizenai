
/**
 * @fileOverview Type definitions for the agent roadmap generator AI flow.
 */
import {z} from 'genkit';

export const AgentRoadmapInputSchema = z.object({
  agentTypes: z.array(z.string()).describe('A list of desired agent types to generate roadmaps for.'),
});
export type AgentRoadmapInput = z.infer<typeof AgentRoadmapInputSchema>;

const WorkflowStepSchema = z.object({
  id: z.string().describe('A unique identifier for the workflow step (e.g., "step-1").'),
  title: z.string().describe('The title of the workflow step (e.g., "Data Ingestion").'),
  description: z.string().describe('A detailed description of what this step entails.'),
});

export const AgentRoadmapOutputSchema = z.object({
    roadmaps: z.array(
        z.object({
            agentType: z.string().describe('The type of agent this roadmap is for.'),
            summary: z.string().describe("A brief summary of the agent's purpose and the generated roadmap."),
            workflowSteps: z.array(WorkflowStepSchema).describe('An array of clear, step-by-step workflow stages for the agent, which will be visualized.'),
        })
    ),
    n8nWorkflowJson: z.string().describe("A single, complete, and valid n8n workflow JSON string. This JSON should contain all the nodes and connections for every agent roadmap generated. It must be directly importable into n8n."),
});
export type AgentRoadmapOutput = z.infer<typeof AgentRoadmapOutputSchema>;

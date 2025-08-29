
/**
 * @fileOverview Type definitions for the agent roadmap generator AI flow.
 */
import {z} from 'genkit';

export const AgentRoadmapInputSchema = z.object({
    agentName: z.string().describe('The name of the agent.'),
    agentType: z.string().describe('The type of agent.'),
    agentDescription: z.string().describe('A description of what the agent does.'),
});
export type AgentRoadmapInput = z.infer<typeof AgentRoadmapInputSchema>;

const WorkflowStepSchema = z.object({
  id: z.string().describe('A unique identifier for the workflow step (e.g., "step-1").'),
  title: z.string().describe('The title of the workflow step (e.g., "Data Ingestion").'),
  description: z.string().describe('A detailed description of what this step entails.'),
});

const RoadmapSchema = z.object({
    agentType: z.string().describe('The type of agent this roadmap is for.'),
    summary: z.string().describe("A brief summary of the agent's purpose and the generated roadmap."),
    workflowSteps: z.array(WorkflowStepSchema).describe('An array of clear, step-by-step workflow stages for the agent, which will be visualized.'),
});

export const AgentRoadmapOutputSchema = z.object({
    roadmap: RoadmapSchema,
    n8nWorkflowJson: z.string().describe("A complete and valid n8n workflow JSON string for the agent. It must be directly importable into n8n."),
});
export type AgentRoadmapOutput = z.infer<typeof AgentRoadmapOutputSchema>;

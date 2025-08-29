
/**
 * @fileOverview Type definitions for the AI agent roadmap generator flow.
 */
import {z} from 'genkit';

export const AgentRoadmapInputSchema = z.object({
  agentName: z.string().describe('The desired name for the AI agent.'),
  agentType: z.string().describe('The type of agent to be created (e.g., "Chatbot", "Data Processor", "API Integrator").'),
  platformName: z.enum(['n8n', 'Make.com', 'Zapier']).describe('The target platform for the agent.'),
  description: z.string().optional().describe('A brief description of what the agent should do.'),
});
export type AgentRoadmapInput = z.infer<typeof AgentRoadmapInputSchema>;

const WorkflowStepSchema = z.object({
  id: z.string().describe('A unique identifier for the workflow step.'),
  title: z.string().describe('The title of the workflow step.'),
  description: z.string().describe('A detailed description of what this step entails.'),
});

const ResourceTipSchema = z.object({
  title: z.string().describe('The title of the resource or tip.'),
  content: z.string().describe('The detailed content of the resource or tip.'),
});

export const AgentRoadmapOutputSchema = z.object({
  summary: z.string().describe("A brief, encouraging summary of the agent's purpose and the generated roadmap."),
  workflowSteps: z.array(WorkflowStepSchema).describe('A list of clear, step-by-step workflow stages for the agent.'),
  jsonOutput: z.string().describe("A valid JSON string representing the full workflow, which can be directly imported into the specified platform."),
  resourcesAndTips: z.array(ResourceTipSchema).describe('A list of helpful resources and tips for building the agent.'),
});
export type AgentRoadmapOutput = z.infer<typeof AgentRoadmapOutputSchema>;

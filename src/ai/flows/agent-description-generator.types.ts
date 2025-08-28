/**
 * @fileOverview Type definitions for the agent description generator AI flow.
 */
import {z} from 'genkit';

export const AgentDescriptionInputSchema = z.object({
    agentName: z.string().describe("The name of the AI agent."),
    agentType: z.string().describe("The type or category of the AI agent."),
    platformName: z.string().describe("The platform where the agent will be used (e.g., n8n, Zapier)."),
});
export type AgentDescriptionInput = z.infer<typeof AgentDescriptionInputSchema>;

export const AgentDescriptionOutputSchema = z.object({
  description: z.string().describe("The generated, detailed description for the AI agent."),
});
export type AgentDescriptionOutput = z.infer<typeof AgentDescriptionOutputSchema>;


'use server';

/**
 * @fileOverview Generates a complete roadmap for building an AI agent.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    AgentRoadmapInputSchema,
    AgentRoadmapOutputSchema,
    type AgentRoadmapInput,
    type AgentRoadmapOutput,
} from './agent-roadmap-generator.types';

export async function generateAgentRoadmap(input: AgentRoadmapInput): Promise<AgentRoadmapOutput> {
  return agentRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentRoadmapGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AgentRoadmapInputSchema},
  output: {schema: AgentRoadmapOutputSchema},
  prompt: `You are an expert AI agent architect for automation platforms like n8n, Make.com, and Zapier. Your task is to generate a complete and functional roadmap for creating the specified AI agent.

  **User's Request:**
  - **Agent Name:** {{{agentName}}}
  - **Agent Type:** {{{agentType}}}
  - **Platform:** {{{platformName}}}
  - **Description:** {{#if description}}{{{description}}}{{else}}Not provided.{{/if}}

  **Your Task:**
  Generate a comprehensive roadmap for creating the specified AI agent on the selected platform. The output must be a valid JSON object that follows the defined schema.

  **Instructions:**
  1.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  2.  **Workflow Steps:** Define a clear, step-by-step workflow for the agent. Provide a few logical steps (e.g., Trigger, Pre-Processing, AI Model Call, Output Formatting, etc.). Each step must have a unique 'id', 'title', and 'description'.
  3.  **Platform JSON Output:** Create a valid workflow JSON string that a user can directly import into the specified platform. This JSON should be complete and reflect the workflow steps. You must invent a plausible structure for the requested platform. For n8n, use a nodes-and-connections structure. For other platforms, create a suitable structure. Ensure the JSON is properly escaped within the final string.
  4.  **Resources and Tips:** Provide a list of 3-4 helpful resources and tips. Each item must have a 'title' and 'content'. Include topics relevant to building workflows with AI on the specified platform.
  `,
});

const agentRoadmapFlow = ai.defineFlow(
  {
    name: 'agentRoadmapFlow',
    inputSchema: AgentRoadmapInputSchema,
    outputSchema: AgentRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

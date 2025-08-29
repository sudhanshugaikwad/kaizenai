
'use server';

/**
 * @fileOverview Generates a complete roadmap for building AI agents, including workflow steps for visualization.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    AgentRoadmapInputSchema,
    AgentRoadmapOutputSchema,
    type AgentRoadmapInput,
    type AgentRoadmapOutput
} from './agent-roadmap-generator.types';

export async function generateAgentRoadmap(input: AgentRoadmapInput): Promise<AgentRoadmapOutput> {
  return agentRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentRoadmapGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AgentRoadmapInputSchema},
  output: {schema: AgentRoadmapOutputSchema},
  prompt: `You are an expert AI agent architect. Your task is to generate a comprehensive roadmap for creating various types of AI agents. For each agent type provided by the user, you must generate a separate roadmap.

  **User's Requested Agent Types:**
  {{#each agentTypes}}
  - {{{this}}}
  {{/each}}

  **Your Task:**
  For EACH requested agent type, generate a complete and functional roadmap. The output must be a valid JSON object that follows the defined schema.

  **Instructions for each roadmap:**
  1.  **Agent Type:** Clearly state the agent type this roadmap corresponds to.
  2.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  3.  **Workflow Steps:** Define a clear, step-by-step workflow for the agent. This workflow will be visualized using a library like React Flow.
      - Provide a logical sequence of 4-6 steps (e.g., Trigger, Data Collection, Pre-Processing, AI Model Call, Post-Processing, Output).
      - Each step must have a unique 'id' (e.g., "step-1", "step-2"), a concise 'title', and a 'description'.
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

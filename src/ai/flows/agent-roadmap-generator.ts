
'use server';

/**
 * @fileOverview Generates a complete roadmap for building AI agents, including workflow steps for visualization and an n8n-compatible JSON export.
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
  prompt: `You are an expert AI agent architect and n8n workflow specialist. Your task is to generate a comprehensive roadmap and a complete, importable n8n workflow JSON for various types of AI agents requested by the user.

  **User's Requested Agent Types:**
  {{#each agentTypes}}
  - {{{this}}}
  {{/each}}

  **Your Task:**

  **Part 1: Generate Individual Roadmaps**
  For EACH requested agent type, generate a separate, detailed roadmap. Each roadmap must include:
  1.  **Agent Type:** Clearly state the agent type.
  2.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  3.  **Workflow Steps:** Define a clear, step-by-step workflow (4-6 steps). Each step must have a unique 'id', a 'title', and a 'description'. This will be used for a visual graph.

  **Part 2: Generate a Single n8n Workflow JSON**
  After defining the individual roadmaps, create a SINGLE, valid n8n workflow JSON string that contains ALL the generated agents as separate nodes. This JSON must be directly importable into n8n.

  **n8n JSON Structure Requirements:**
  - **name:** A suitable name for the entire workflow, like "Kaizen AI Agent Collection".
  - **nodes:** An array of all nodes for ALL agents. Use appropriate n8n node types (e.g., 'n8n-nodes-base.webhook', 'n8n-nodes-base.function', 'n8n-nodes-base.openAi', 'n8n-nodes-base.if', 'n8n-nodes-base.respondToWebhook').
      - Each node must have a unique name, correct parameters, type, typeVersion, and position.
      - Arrange nodes for each agent workflow logically on the canvas (e.g., in horizontal rows, separated vertically).
  - **connections:** An object defining the connections between the nodes for each agent workflow. Ensure the "main" output of one node correctly links to the "main" input of the next.

  The final output must be a valid JSON object that follows the defined schema, containing both the array of 'roadmaps' and the 'n8nWorkflowJson' string.
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

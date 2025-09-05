
'use server';

/**
 * @fileOverview Generates a complete roadmap for building a single AI agent, including workflow steps and an n8n-compatible JSON export.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    AgentRoadmapInputSchema,
    AgentRoadmapOutputSchema,
    type AgentRoadmapInput,
    type AgentRoadmapOutput
} from './agent-roadmap-generator.types';

export { type AgentRoadmapInput, type AgentRoadmapOutput };

export async function generateAgentRoadmap(input: AgentRoadmapInput): Promise<AgentRoadmapOutput> {
  return agentRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentRoadmapGeneratorPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: AgentRoadmapInputSchema},
  output: {schema: AgentRoadmapOutputSchema},
  prompt: `You are an expert AI agent architect and n8n workflow specialist. Your task is to generate a comprehensive roadmap and a complete, importable n8n workflow JSON for the AI agent requested by the user.

  **User's Requested Agent:**
  - **Agent Name:** {{{agentName}}}
  - **Agent Type:** {{{agentType}}}
  - **Agent Description:** {{{agentDescription}}}

  **Your Task:**

  **Part 1: Generate the Roadmap**
  Generate a detailed roadmap for the specified agent. The roadmap must include:
  1.  **Agent Type:** State the agent type.
  2.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  3.  **Workflow Steps:** Define a clear, step-by-step workflow (4-6 steps). Each step must have a unique 'id', a 'title', and a 'description'. This will be used for a visual graph.

  **Part 2: Generate the n8n Workflow JSON**
  Create a valid n8n workflow JSON string for the agent. This JSON must be directly importable into n8n.

  **n8n JSON Structure Requirements:**
  - **name:** Use the provided agent name.
  - **nodes:** An array of all nodes for the agent workflow. Use appropriate n8n node types (e.g., 'n8n-nodes-base.webhook', 'n8n-nodes-base.function', 'n8n-nodes-base.openAi', 'n8n-nodes-base.if', 'n8n-nodes-base.respondToWebhook').
      - Each node must have a unique name, correct parameters, type, typeVersion, and position.
      - Arrange nodes logically on the canvas.
  - **connections:** An object defining the connections between the nodes.

  The final output must be a valid JSON object that follows the defined schema, containing both the 'roadmap' and the 'n8nWorkflowJson' string.
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


'use server';

/**
 * @fileOverview Generates a complete roadmap for building an AI agent.
 *
 * - generateAgentRoadmap - A function that generates the agent roadmap.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    AgentRoadmapInputSchema,
    AgentRoadmapOutputSchema,
    type AgentRoadmapInput,
    type AgentRoadmapOutput
} from './agent-roadmap-generator.types';

export { type AgentRoadmapOutput };

export async function generateAgentRoadmap(input: AgentRoadmapInput): Promise<AgentRoadmapOutput> {
  return generateAgentRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentRoadmapGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AgentRoadmapInputSchema},
  output: {schema: AgentRoadmapOutputSchema},
  prompt: `You are an expert AI agent architect for n8n. Your task is to generate a complete and functional roadmap for creating the specified AI agent.

  **User's Request:**
  - **Agent Name:** {{{agentName}}}
  - **Agent Type:** {{{agentType}}}
  - **Platform:** {{{platformName}}}
  - **Description:** {{#if description}}{{{description}}}{{else}}Not provided.{{/if}}

  **Your Task:**
  Generate a comprehensive roadmap for creating the specified AI agent on the n8n platform. The output must be a valid JSON object that follows the defined schema.

  **Instructions:**
  1.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  2.  **Workflow Steps:** Define a clear, step-by-step workflow for the agent. Provide 4 logical steps: 1. "Manual Trigger", 2. "Set Input Data", 3. "AI Model Call", and 4. "Output Formatting". Each step must have a unique 'id', 'title', and 'description'.
  3.  **JSON Output:** Create a valid n8n workflow JSON string that a user can directly import.
      - The workflow must have 4 nodes corresponding to the workflow steps.
      - **Node 1 (startNode):** A "Start" node.
      - **Node 2 (setNode):** A "Set" node to define the input. Give it a descriptive name and include a string field named \`prompt\`.
      - **Node 3 (aiNode):** A "Google Gemini" node. Set the "Model" to "gemini-1.5-flash-latest" and configure the "Text" field to use the prompt from the Set node using an n8n expression.
      - **Node 4 (outputNode):** A "Respond to Webhook" node. Configure it to return the text output from the Gemini node using an n8n expression.
      - Define the connections between the nodes logically: Start -> Set -> AI -> Respond.
  4.  **Resources and Tips:** Provide a list of 3-4 helpful resources and tips. Each item must have a 'title' and 'content'. Include topics relevant to building n8n workflows with AI.

  Generate the response in the required JSON format.
  `
});


const generateAgentRoadmapFlow = ai.defineFlow(
  {
    name: 'generateAgentRoadmapFlow',
    inputSchema: AgentRoadmapInputSchema,
    outputSchema: AgentRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


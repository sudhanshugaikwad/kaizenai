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
  prompt: `You are an expert AI agent architect and developer, specializing in building workflows on platforms like n8n, Make.com, and Zapier.

  **User's Request:**
  - **Agent Name:** {{{agentName}}}
  - **Agent Type:** {{{agentType}}}
  - **Platform:** {{{platformName}}}
  - **Description:** {{#if description}}{{{description}}}{{else}}Not provided.{{/if}}

  **Your Task:**
  Generate a complete and detailed roadmap for creating the specified AI agent.

  **Instructions:**
  1.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  2.  **Workflow Steps:** Define a clear, step-by-step workflow for the agent. Provide 4-6 logical steps. For each step, include a unique 'id', a 'title', and a 'description'. The steps should be logical and easy to follow (e.g., "Step 1: Trigger Node", "Step 2: Data Processing", "Step 3: AI Model Call", "Step 4: Output Formatting", "Step 5: Final Action").
  3.  **JSON Output:** Create a sample JSON structure that represents the workflow for the specified **{{{platformName}}}**. This should be a valid JSON string that a user could theoretically copy and import. For n8n, include nodes, connections, and basic parameters. For other platforms, create a logical representation.
  4.  **Resources and Tips:** Provide a list of 3-4 helpful resources and tips. Each item should have a 'title' and 'content'. Include topics like "API Key Management," "Error Handling," "Optimizing AI Prompts," and "Testing Your Agent."

  Generate the response in the required JSON format.
  `,
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

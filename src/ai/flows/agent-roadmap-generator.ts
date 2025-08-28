'use server';

/**
 * @fileOverview Generates a complete roadmap for building an AI agent.
 *
 * - generateAgentRoadmap - A function that generates the agent roadmap.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

export const AgentRoadmapInputSchema = z.object({
    agentName: z.string().describe("The name of the AI agent."),
    agentType: z.string().describe("The type or category of the AI agent."),
    platformName: z.string().describe("The target platform (e.g., n8n, Make.com)."),
    description: z.string().optional().describe("A user-provided description of the agent's function."),
});
export type AgentRoadmapInput = z.infer<typeof AgentRoadmapInputSchema>;

export const AgentRoadmapOutputSchema = z.object({
    summary: z.string().describe("A brief summary of the generated roadmap and the agent's purpose."),
    workflowSteps: z.array(z.object({
        id: z.string().describe("A unique identifier for the step (e.g., 'step1')."),
        title: z.string().describe("The title of the workflow step."),
        description: z.string().describe("A brief description of what this step involves."),
    })).describe("A list of structured steps to build the agent workflow."),
    jsonOutput: z.string().describe("A JSON string representing the workflow, formatted for the specified platform (e.g., n8n)."),
    resourcesAndTips: z.array(z.object({
        title: z.string().describe("The title of the resource or tip."),
        content: z.string().describe("The detailed content of the resource or tip."),
    })).describe("A list of helpful resources, tips, and best practices."),
});
export type AgentRoadmapOutput = z.infer<typeof AgentRoadmapOutputSchema>;

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

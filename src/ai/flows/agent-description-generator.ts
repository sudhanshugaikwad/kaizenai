
'use server';

/**
 * @fileOverview Generates a description for an AI agent.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const AgentDescriptionInputSchema = z.object({
  agentName: z.string().describe('The name of the agent.'),
  agentType: z.string().describe('The type of agent.'),
});
export type AgentDescriptionInput = z.infer<typeof AgentDescriptionInputSchema>;

const AgentDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description for the agent.'),
});
export type AgentDescriptionOutput = z.infer<typeof AgentDescriptionOutputSchema>;


export async function generateAgentDescription(input: AgentDescriptionInput): Promise<AgentDescriptionOutput> {
  return agentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentDescriptionGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: AgentDescriptionInputSchema},
  output: {schema: AgentDescriptionOutputSchema},
  prompt: `You are an expert technical writer. Based on the provided agent name and type, generate a concise, one-paragraph description of what the agent does. The description should be suitable for use in documentation or as a summary.

  - **Agent Name:** {{{agentName}}}
  - **Agent Type:** {{{agentType}}}

  Generate a clear and informative description that explains the primary function and purpose of this AI agent.
  `,
});

const agentDescriptionFlow = ai.defineFlow(
  {
    name: 'agentDescriptionFlow',
    inputSchema: AgentDescriptionInputSchema,
    outputSchema: AgentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
